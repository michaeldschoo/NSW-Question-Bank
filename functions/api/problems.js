export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare("SELECT * FROM problems LIMIT 100").all();
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, hint: "D1 바인딩 또는 테이블 생성 확인 필요" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}