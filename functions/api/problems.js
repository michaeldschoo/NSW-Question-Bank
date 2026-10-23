export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const stageFilter = url.searchParams.get('stage');

  let sql = "SELECT * FROM problems";
  let binds = [];
  if (stageFilter && stageFilter !== 'all') {
    // id가 S4-EN-001-40 형태이므로 LIKE로 검색
    sql += " WHERE stage LIKE ? OR id LIKE ?";
    binds.push(`%${stageFilter}%`, `S${stageFilter}-%`);
  }
  sql += " ORDER BY id LIMIT 300";

  try {
    const stmt = env.DB.prepare(sql);
    const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();

    const subjectMap = {
      '영어': { en: 'English', kr: '영어' },
      '수학': { en: 'Math', kr: '수학' },
      '사고력': { en: 'Thinking Skill', kr: '사고력' },
      'Thinking Skill': { en: 'Thinking Skill', kr: '사고력' },
      'English': { en: 'English', kr: '영어' },
      'Math': { en: 'Math', kr: '수학' }
    };

    const mapped = results.map(r => {
      // stage 추출: "Stage 3" -> 3, "S4-EN..." -> 4
      let stageNum = 1;
      if (typeof r.stage === 'string' && r.stage.includes('Stage')) {
        stageNum = parseInt(r.stage.replace(/\D/g,'')) || 1;
      } else if (r.id && r.id.match(/S(\d)/)) {
        stageNum = parseInt(r.id.match(/S(\d)/)[1]);
      } else {
        stageNum = parseInt(r.stage) || 1;
      }

      // subject 번역
      const subj = subjectMap[r.subject] || { en: r.subject, kr: r.subject };
      const subject = lang === 'kr' ? subj.kr : subj.en;

      // stem: 언어별 선택
      let rawStem = lang === 'kr' ? (r.q_kr || r.q_en) : (r.q_en || r.q_kr);
      
      // options가 ["A","B","C","D"] placeholder면 이미지 필요 표시
      let options = r.options;
      try {
        if (typeof options === 'string') options = JSON.parse(options);
      } catch(e) { options = ["A","B","C","D"]; }
      
      if (!options || options.length === 0 || (options[0]==="A" && options[1]==="B")) {
        // 실제 이미지 문제: placeholder를 유지하되, 설명에 이미지 필요 명시
        options = lang === 'kr' 
          ? ["이미지 A", "이미지 B", "이미지 C", "이미지 D"]
          : ["Image A", "Image B", "Image C", "Image D"];
      }

      // q_kr/q_en 안에 A) B) C) D) 가 포함된 경우 분리 (영어 읽기 문제)
      const optionRegex = /\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*)/s;
      const match = rawStem.match(optionRegex);
      if (match) {
        rawStem = rawStem.split(/A\)/)[0].trim();
        options = [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()];
      }

      const a = String(r.answer||'A').trim().toUpperCase();
      const answerIdx = ['A','B','C','D'].indexOf(a) >=0 ? ['A','B','C','D'].indexOf(a) : parseInt(a) || 0;

      return {
        id: r.id,
        stage: stageNum,
        subject: subject,
        skillCode: r.topic || r.skillCode || "Pattern",
        abilityCode: r.subtype || r.abilityCode || "General",
        difficulty: r.difficulty || "M",
        stem: rawStem,
        q_kr: r.q_kr,
        q_en: r.q_en,
        options: options,
        answer: answerIdx,
        explanation: lang === 'kr' 
          ? r.explanation_kr || r.explanation
          : (r.explanation_en || r.explanation || `Rule: ${r.rule1 || ''} ${r.rule2 || ''}`),
        source: r.source,
        tags: r.tags || [r.topic]
      };
    });

    // lang에 따라 필터링은 안 하고, subject만 번역해서 반환
    // 영어 버전에서도 한국어 subject가 섞이지 않도록 subjectMap으로 완전 분리

    return new Response(JSON.stringify(mapped), {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8', 
        'Access-Control-Allow-Origin': '*' 
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const { problems } = await request.json();
    if (!Array.isArray(problems) || problems.length === 0) {
      return new Response(JSON.stringify({ error: "No problems" }), { status: 400 });
    }

    const { results: existing } = await env.DB.prepare(
      "SELECT subject, stage, difficulty, question FROM problems WHERE question IS NOT NULL"
    ).all();
    const makeComposite = (subject, stage, difficulty, question) =>
      `${subject}|${stage}|${difficulty}|${String(question ?? '').trim()}`;
    const existingSet = new Set(
      existing.map(r => makeComposite(r.subject, r.stage, r.difficulty, r.question))
    );

    let saved = 0, skipped = 0;
    for (const p of problems) {
      const question = String(p.question ?? '').trim();
      const composite = makeComposite(p.subject, p.stage, p.difficulty, question);

      // 같은 문제 내용은 ID가 달라도 저장하지 않음
      if (existingSet.has(composite)) {
        skipped++;
        continue;
      }

      const idExists = await env.DB.prepare(
        "SELECT id FROM problems WHERE id = ?"
      ).bind(p.id).first();
      if (idExists) {
        skipped++;
        continue;
      }

      const result = await env.DB.prepare(
        `INSERT OR IGNORE INTO problems
         (id, stage, subject, difficulty, question, options, answer, explanation, skill, tag)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        p.id,
        p.stage,
        p.subject,
        p.difficulty,
        question,
        JSON.stringify(p.options),
        typeof p.answer === 'number' ? p.options[p.answer] : p.answer,
        p.explanation,
        p.skill || 'General',
        p.tag || 'generated'
      ).run();

      if (result.meta.changes > 0) {
        saved++;
        existingSet.add(composite);
      } else {
        skipped++;
      }
    }

    return new Response(JSON.stringify({
      saved,
      skipped,
      total: problems.length,
      message: `Saved ${saved}, skipped ${skipped} duplicates`
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
