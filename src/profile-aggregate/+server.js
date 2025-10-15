// src/routes/api/profile-aggregate/+server.js
export async function GET({ fetch }) {
  const [streak] = await Promise.all([
    fetch('/api/user/streaks'),
  ]);

  if (!streak.ok) {
    return new Response(JSON.stringify({ error: 'API 호출 실패' }), { status: 500 });
  }

  return new Response(
    JSON.stringify({
      streak: await streak.json(),
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
