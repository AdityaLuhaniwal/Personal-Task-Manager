const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/tasks.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load tasks from file on startup, or start empty
let tasks = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    tasks = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Could not load tasks from file, starting fresh:', err.message);
  tasks = [];
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Failed to persist tasks:', err.message);
  }
}

function getAll() {
  return [...tasks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function getById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function create(task) {
  tasks.push(task);
  persist();
  return task;
}

function update(id, changes) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...changes, updatedAt: new Date().toISOString() };
  persist();
  return tasks[index];
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  persist();
  return true;
}

module.exports = { getAll, getById, create, update, remove };
