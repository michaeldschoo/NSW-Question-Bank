export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const stage = url.searchParams.get('stage');
  const subject = url.searchParams.get('subject');
  
  try {
    let query = "SELECT * FROM problems";
    let params = [];
    
    if (stage) {
      query += " WHERE stage = ?";
      params.push(stage);
    }
    
    const stmt = context.env.DB.prepare(query);
    const result = params.length ? await stmt.bind(...params).all() : await stmt.all();
    
    return new Response(JSON.stringify(result.results || []), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}