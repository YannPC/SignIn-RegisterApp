const http = require('http');
const { URL } = require('url');
const { sendJson, login, register } = require('../api');

const port = process.env.PORT || 3000;

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (pathname === '/api/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const result = await login(body);
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, 400, { message: 'Unable to parse request body.' });
    }
    return;
  }

  if (pathname === '/api/register' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const result = await register(body);
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, 400, { message: 'Unable to parse request body.' });
    }
    return;
  }

  if (pathname === '/api/users' && req.method === 'GET') {
    sendJson(res, 200, { message: 'Mock user endpoint is available.' });
    return;
  }

  sendJson(res, 404, { message: 'Route not found.' });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock API server is running at http://localhost:${port}`);
});
