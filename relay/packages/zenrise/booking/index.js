/**
 * Zenrise booking relay — DigitalOcean Function.
 *
 * Receives the booking form payload as JSON, sends two emails via the
 * Mailgun HTTP API:
 *   1. notify  → NOTIFY_TO (Zenrise inbox), always in English + key facts
 *   2. confirm → the customer, in their site language (payload.lang)
 *
 * Config via environment (set in project.yml from .env at deploy time):
 *   MAILGUN_API_KEY  private API key
 *   MAILGUN_DOMAIN   sending domain (sandboxXXXX.mailgun.org until
 *                    mg.zenrise.jp is verified — sandbox only delivers
 *                    to authorized recipients)
 *   MAILGUN_REGION   "us" or "eu"
 *   NOTIFY_TO        where booking notifications go
 *   REPLY_TO         Reply-To on the customer confirmation
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function field(v) {
  return (v === undefined || v === null || String(v).trim() === '') ? '—' : String(v).trim();
}

function notifyText(b) {
  return [
    'New booking request via zenrise.jp',
    '',
    'Reference:  ' + field(b.ref),
    'Language:   ' + (b.lang === 'ja' ? 'Japanese' : 'English'),
    '',
    'Towns:      ' + field((b.region || []).join(', ')),
    'Length:     ' + field(b.length),
    'Dates:      ' + (b.dateFrom || b.dateTo ? field(b.dateFrom) + ' → ' + field(b.dateTo) : 'Flexible'),
    'Group:      ' + field(b.party),
    'Visited:    ' + field(b.experience),
    '',
    'Name:       ' + field(b.name),
    'Email:      ' + field(b.email),
    'From:       ' + field(b.from),
    'Interests:  ' + field((b.interests || []).join(', ')),
    '',
    'Notes:',
    field(b.notes),
  ].join('\n');
}

function confirmSubject(b) {
  return b.lang === 'ja'
    ? 'ご予約リクエストを受け付けました — ' + field(b.ref)
    : 'We have your request — ' + field(b.ref);
}

function confirmText(b) {
  if (b.lang === 'ja') {
    return [
      field(b.name) + ' 様',
      '',
      'ZENRISEへのご予約リクエストをありがとうございます。',
      '2営業日以内に、ご希望に沿った旅程案を2〜3件お送りいたします。',
      '',
      'ご参照番号: ' + field(b.ref),
      '',
      'お問い合わせの際は、この番号を添えて hello@zenrise.jp までご連絡ください。',
      '',
      'ZENRISE',
    ].join('\n');
  }
  return [
    'Hello ' + field(b.name) + ',',
    '',
    'Thank you for your booking request with Zenrise.',
    'We’ll write back within two working days with two or three itinerary sketches that fit your dates.',
    '',
    'Your reference: ' + field(b.ref),
    '',
    'If you need to reach us in the meantime, reply to this email or write to hello@zenrise.jp and quote your reference.',
    '',
    'ZENRISE',
  ].join('\n');
}

async function mailgunSend(env, msg) {
  const base = env.MAILGUN_REGION === 'eu' ? 'https://api.eu.mailgun.net' : 'https://api.mailgun.net';
  const res = await fetch(base + '/v3/' + env.MAILGUN_DOMAIN + '/messages', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from('api:' + env.MAILGUN_API_KEY).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(msg).toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('mailgun ' + res.status + ': ' + text);
  }
  return res.json();
}

exports.main = async function (args) {
  if (args.__ow_method && args.__ow_method.toUpperCase() === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const env = process.env;
  const b = args; // web functions merge the JSON body into args

  // honeypot: the form never fills "website"; bots usually do
  if (b.website) return { statusCode: 200, headers: CORS, body: { ok: true } };

  if (!b.name || !b.email || !/.+@.+/.test(String(b.email)) || !b.ref) {
    return { statusCode: 400, headers: CORS, body: { ok: false, error: 'missing fields' } };
  }

  const from = 'Zenrise <bookings@' + env.MAILGUN_DOMAIN + '>';

  try {
    await mailgunSend(env, {
      from: from,
      to: env.NOTIFY_TO,
      subject: 'Booking request ' + field(b.ref) + ' — ' + field(b.name),
      text: notifyText(b),
      'h:Reply-To': String(b.email).trim(),
    });
    await mailgunSend(env, {
      from: from,
      to: String(b.email).trim(),
      subject: confirmSubject(b),
      text: confirmText(b),
      'h:Reply-To': env.REPLY_TO || 'hello@zenrise.jp',
    });
  } catch (e) {
    console.error(e.message);
    // the notify may have gone through even if the confirm failed;
    // surface a retryable error to the form either way
    return { statusCode: 502, headers: CORS, body: { ok: false, error: 'send failed' } };
  }

  return { statusCode: 200, headers: CORS, body: { ok: true } };
};
