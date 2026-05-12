export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await req.json();
  const { eventName, eventId, sourceUrl, userData } = body;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: sourceUrl,
        action_source: 'website',
        user_data: {
          client_ip_address: req.headers.get('x-forwarded-for') || '',
          client_user_agent: req.headers.get('user-agent') || '',
          ...(userData || {}),
        },
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/1348713502744731/events?access_token=${process.env.META_ACCESS_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();
  return new Response(JSON.stringify(result), {
    status: res.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
