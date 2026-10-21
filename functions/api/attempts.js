export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const id = crypto.randomUUID();
    await context.env.DB.prepare(
      "INSERT INTO attempts (id, student_id, problem_id, is_correct, time_spent) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, data.student_id, data.problem_id, data.is_correct, data.time_spent).run();
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}