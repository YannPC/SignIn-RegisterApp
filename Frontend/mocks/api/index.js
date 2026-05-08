const fs = require('fs').promises;
const path = require('path');

const dbPath = path.resolve(__dirname, '../db/users.json');

async function readDb() {
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
}

async function login(payload) {
  const db = await readDb();
  const { username, password } = payload;

  if (!username || !password) {
    return { status: 400, body: { message: 'Username and password are required.' } };
  }

  const user = db.users.find((item) => item.username === username && item.password === password);

  if (!user) {
    return { status: 401, body: { message: 'Invalid username or password.' } };
  }

  return { status: 200, body: { message: 'Login successful.' } };
}

async function register(payload) {
  const db = await readDb();
  const { username, email, password, confirmPassword } = payload;

  if (!username || !email || !password || !confirmPassword) {
    return { status: 400, body: { message: 'All registration fields are required.' } };
  }

  if (password !== confirmPassword) {
    return { status: 400, body: { message: 'Passwords do not match.' } };
  }

  if (db.users.some((item) => item.username === username)) {
    return { status: 409, body: { message: 'Username already exists.' } };
  }

  if (db.users.some((item) => item.email === email)) {
    return { status: 409, body: { message: 'Email already in use.' } };
  }

  const nextId = db.users.length ? Math.max(...db.users.map((item) => item.id)) + 1 : 1;
  db.users.push({ id: nextId, username, email, password });
  await writeDb(db);

  return { status: 201, body: { message: 'Registration successful.' } };
}

module.exports = { sendJson, login, register };
