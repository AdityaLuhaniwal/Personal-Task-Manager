const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store/taskStore');

const router = express.Router();

// GET /api/tasks — list all tasks (optionally filtered by status or search)
router.get('/', (req, res) => {
  const { status, search } = req.query;
  let tasks = store.getAll();

  if (status && status !== 'all') {
    const completed = status === 'completed';
    tasks = tasks.filter((t) => t.completed === completed);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }

  res.json(tasks);
});

// GET /api/tasks/:id — get a single task
router.get('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /api/tasks — create a new task
router.post('/', (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const task = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : '',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = store.create(task);
  res.status(201).json(created);
});

// PATCH /api/tasks/:id — update a task (title, description, dueDate, completed)
router.patch('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, dueDate, completed } = req.body;
  const changes = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    changes.title = title.trim();
  }

  if (description !== undefined) changes.description = description;
  if (dueDate !== undefined) changes.dueDate = dueDate;
  if (completed !== undefined) changes.completed = Boolean(completed);

  const updated = store.update(req.params.id, changes);
  res.json(updated);
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

module.exports = router;
