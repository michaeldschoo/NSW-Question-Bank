export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'en';
  const stage = url.searchParams.get('stage');
  
  let query = "SELECT * FROM problems";
  let params = [];
  
  if (stage && stage !== 'all') {
    query += " WHERE stage = ?";
    params.push(stage);
  }
  query += " ORDER BY CAST(stage AS INTEGER), id LIMIT 300";
  
  try {
    const stmt = env.DB.prepare(query);
    const bound = params.length ? stmt.bind(...params) : stmt;
    const { results } = await bound.all();
    
    const mapped = results.map(row => {
      // q_en / q_kr 선택
      const stem = lang === 'kr' ? (row.q_kr || row.q_en) : (row.q_en || row.q_kr);
      
      // answer 처리
      let answerIdx = 0;
      if (typeof row.answer === 'string') {
        const a = row.answer.trim().toUpperCase();
        if (['A','B','C','D'].includes(a)) answerIdx = a.charCodeAt(0) - 65;
        else if (!isNaN(parseInt(a))) answerIdx = parseInt(a) % 4;
      } else {
        answerIdx = row.answer || 0;
      }
      
      // options - problem_bank 구조에 따라 rule1, rule2 또는 기본값
      let options = [];
      try {
        if (row.q_en && row.q_en.includes('|')) {
          // 파이프로 구분된 경우
          options = row.q_en.split('|').slice(1,5);
        }
      } catch(e){}
      
      if (row.rule1 && row.rule2) {
        options = [row.rule1, row.rule2, row.rule1 + " (변형)", row.rule2 + " (변형)"];
      }
      
      if (options.length < 4) {
        options = ["Choice A", "Choice B", "Choice C", "Choice D"];
      }
      
      return {
        id: String(row.id),
        stage: parseInt(row.stage) || 1,
        subject: row.subject || "Math",
        skillCode: row.topic || row.subtype || "A1",
        abilityCode: row.skill_type || "R",
        difficulty: row.difficulty === 0 || row.difficulty === "E" ? "E" : row.difficulty === 1 || row.difficulty === "M" ? "M" : row.difficulty === 2 || row.difficulty === "H" ? "H" : (row.difficulty || "M"),
        stem: stem,
        q_kr: row.q_kr,
        q_en: row.q_en,
        options: options.slice(0,4),
        answer: answerIdx,
        explanation: row.explanation_kr || row.rule1 || "",
        source: row.source || "bank",
        time_sec: row.time_sec || 60,
        tags: [row.subject, row.topic].filter(Boolean)
      };
    });
    
    return new Response(JSON.stringify(mapped), {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}