export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const stageFilter = url.searchParams.get('stage');
  let sql = "SELECT * FROM problems";
  let binds = [];
  if (stageFilter && stageFilter !== 'all') {
    sql += " WHERE stage LIKE ? OR id LIKE ?";
    binds.push(`%${stageFilter}%`, `S${stageFilter}-%`);
  }
  sql += " ORDER BY id LIMIT 500";
  try {
    const stmt = env.DB.prepare(sql);
    const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();
    const subjectMap = {
      '영어': { en: 'English', kr: '영어' }, '수학': { en: 'Math', kr: '수학' },
      '사고력': { en: 'Thinking Skill', kr: '사고력' }, '과학': { en: 'Science', kr: '과학' },
      'Thinking Skill': { en: 'Thinking Skill', kr: '사고력' }, 'Science': { en: 'Science', kr: '과학' },
      'English': { en: 'English', kr: '영어' }, 'Math': { en: 'Math', kr: '수학' }
    };
    const mapped = results.map(r => {
      let stageNum = 1;
      if (typeof r.stage === 'string' && r.stage.includes('Stage')) stageNum = parseInt(r.stage.replace(/\D/g,'')) || 1;
      else if (r.id && r.id.match(/S(\d)/)) stageNum = parseInt(r.id.match(/S(\d)/)[1]);
      else stageNum = parseInt(r.stage) || 1;
      const subj = subjectMap[r.subject] || { en: r.subject, kr: r.subject };
      const subject = lang === 'kr' ? subj.kr : subj.en;
      let rawStem = lang === 'kr' ? (r.q_kr || r.q_en || r.question) : (r.q_en || r.q_kr || r.question);
      let options = r.options;
      try { if (typeof options === 'string') options = JSON.parse(options); } catch(e) { options = []; }
      if (!options || options.length === 0) options = ["A","B","C","D"];
      const optionRegex = /\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*)/s;
      const match = rawStem ? rawStem.match(optionRegex) : null;
      if (match) { rawStem = rawStem.split(/A\)/)[0].trim(); options = [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()]; }
      const a = String(r.answer||'A').trim().toUpperCase();
      const answerIdx = ['A','B','C','D'].indexOf(a) >=0 ? ['A','B','C','D'].indexOf(a) : (parseInt(a) || 0);
      return { id: r.id, stage: stageNum, subject, skillCode: r.topic||"Pattern", abilityCode: r.subtype||"General", difficulty: r.difficulty===0?'E':r.difficulty===1?'M':r.difficulty===2?'H':(r.difficulty||"M"), stem: rawStem, q_kr: r.q_kr, q_en: r.q_en, options, answer: answerIdx, explanation: lang==='kr' ? (r.explanation_kr||r.explanation) : (r.explanation||r.explanation_kr||`Rule: ${r.rule1||''} ${r.rule2||''}`), source: r.source, tags: [r.topic] };
    });
    return new Response(JSON.stringify(mapped), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const problems = body.problems || body;
    if (!Array.isArray(problems) || problems.length === 0) return new Response(JSON.stringify({ error: "No problems" }), { status: 400 });
    const { results: existing } = await env.DB.prepare("SELECT subject, stage, difficulty, question, id FROM problems").all();
    const makeComposite = (subject, stage, difficulty, question) => `${subject}|${stage}|${difficulty}|${String(question ?? '').trim()}`;
    const existingSet = new Set(existing.map(r => makeComposite(r.subject, r.stage, r.difficulty, r.question)));
    const idSet = new Set(existing.map(r => r.id));
    let saved = 0, skipped = 0;
    for (const p of problems) {
      const question = String(p.question ?? p.q_en ?? p.q_kr ?? '').trim();
      const composite = makeComposite(p.subject, p.stage, p.difficulty, question);
      if (existingSet.has(composite) || idSet.has(p.id)) { skipped++; continue; }
      // ✅ 21개 컬럼 = 21개 ? ← 이게 핵심!
      await env.DB.prepare(
        `INSERT OR IGNORE INTO problems (id, stage, subject, topic, subtype, difficulty, skill_type, source, time_sec, q_kr, q_en, rule1, rule2, answer, explanation_kr, created_at, question, options, explanation, skill, tag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        p.id ?? `GEN-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
        String(p.stage ?? '1'),
        p.subject ?? 'Math',
        p.topic ?? p.subject ?? 'General',
        p.subtype ?? '',
        typeof p.difficulty === 'string' && p.difficulty.length===1 ? (p.difficulty==='E'?0:p.difficulty==='M'?1:2) : (p.difficulty ?? 1),
        p.skill ?? 'General',
        p.source ?? 'template',
        p.time_sec ?? 60,
        p.q_kr ?? question ?? '',
        p.q_en ?? question ?? '',
        p.rule1 ?? '',
        p.rule2 ?? '',
        typeof p.answer === 'number' ? String(p.answer) : (p.answer ?? '0'),
        p.explanation_kr ?? p.explanation ?? '',
        new Date().toISOString(),
        question ?? '',
        JSON.stringify(p.options ?? []),
        p.explanation ?? '',
        p.skill ?? 'General',
        p.tag ?? 'generated'
      ).run();
      saved++; existingSet.add(composite); idSet.add(p.id);
    }
    return new Response(JSON.stringify({ saved, skipped, total: problems.length }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
}