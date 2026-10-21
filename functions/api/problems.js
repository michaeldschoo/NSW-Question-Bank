export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const stageFilter = url.searchParams.get('stage');

  let sql = "SELECT * FROM problems";
  let binds = [];
  if (stageFilter && stageFilter !== 'all') {
    sql += " WHERE id LIKE ?";
    binds.push(`%S${stageFilter}-%`);
  }
  sql += " LIMIT 300";

  try {
    const stmt = env.DB.prepare(sql);
    const { results } = await (binds.length ? stmt.bind(...binds) : stmt).all();

    const mapped = results.map(r => {
      // stage는 id에서 추출: S4-EN-001-40 -> 4
      const stageFromId = parseInt((r.id.match(/S(\d)/)||[])[1]) || r.stage || 1;
      
      // 본문에서 A) B) C) D) 추출
      const rawText = lang === 'kr' ? (r.q_kr || r.q_en) : (r.q_en || r.q_kr);
      
      // 선택지가 본문에 포함된 경우 분리
      let stem = rawText;
      let options = [];
      
      // 패턴: A) ... B) ... C) ... D) ...
      const optionRegex = /\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*)/s;
      const match = rawText.match(optionRegex);
      
      if (match) {
        stem = rawText.split(/A\)/)[0].trim();
        options = [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()];
      } else {
        // 없으면 rule1/rule2는 버리고 기본값
        options = ["A", "B", "C", "D"];
      }

      const a = (r.answer||'A').trim().toUpperCase();
      const answerIdx = ['A','B','C','D'].indexOf(a) >=0 ? ['A','B','C','D'].indexOf(a) : 0;

      let diff = "M";
      const d = parseInt(r.difficulty);
      if (d <= 1) diff = "E";
      else if (d === 2) diff = "M";
      else diff = "H";

      // 영어버전이면 subject도 영어로, explanation도 영어로 (없으면 번역 없이 원문)
      const subjectEn = r.subject === '영어' ? 'English' : r.subject === '사고력' ? 'Thinking' : r.subject;
      const subject = lang === 'kr' ? r.subject : subjectEn;

      return {
        id: r.id,
        stage: stageFromId,
        subject: subject,
        skillCode: r.topic,
        abilityCode: r.subtype,
        difficulty: diff,
        stem: stem,
        q_kr: r.q_kr,
        q_en: r.q_en,
        options: options,
        answer: answerIdx,
        explanation: lang === 'kr' ? r.explanation_kr : r.explanation_kr, // 영어 해설 없으므로 일단 동일, 추후 번역 필요
        source: r.source,
        tags: [r.topic, r.subtype]
      };
    });

    return new Response(JSON.stringify(mapped), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}