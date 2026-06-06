const request = require('supertest');
const app = require('../index');

describe('Task API', () => {
  let createdId;

  test('POST /api/tasks - creates a task with valid title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test task', description: 'A description', dueDate: '2025-12-31' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test task');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  test('POST /api/tasks - rejects missing title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('GET /api/tasks - returns array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH /api/tasks/:id - toggles completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${createdId}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /api/tasks/:id - removes task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdId}`);
    expect(res.status).toBe(204);
  });

  test('GET /api/tasks/:id - 404 for missing task', async () => {
    const res = await request(app).get('/api/tasks/nonexistent-id');
    expect(res.status).toBe(404);
  });
});
