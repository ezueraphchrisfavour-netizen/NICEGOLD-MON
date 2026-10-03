const BASE_URL = 'https://prexzyapis.com';

/**
 * Calls a Prexzy API endpoint and returns the parsed JSON (or raw buffer for binary content).
 *
 * @param {string} path - e.g. '/stalk/ffstalk'
 * @param {object} params - query params for GET, or body fields for POST
 * @param {'GET'|'POST'} method
 */
async function callPrexzy(path, params = {}, method = 'GET') {
  let url = `${BASE_URL}${path}`;
  const options = { method, headers: {} };

  if (method === 'GET') {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(params);
  }

  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return { type: 'json', data: await res.json() };
  }

  if (contentType.startsWith('image/') || contentType.startsWith('audio/') || contentType.startsWith('video/')) {
    return { type: 'buffer', data: Buffer.from(await res.arrayBuffer()), contentType };
  }

  // fallback: try text, then attempt JSON.parse
  const text = await res.text();
  try {
    return { type: 'json', data: JSON.parse(text) };
  } catch {
    return { type: 'text', data: text };
  }
}

module.exports = { callPrexzy, BASE_URL };
