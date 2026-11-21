const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
  next();
});

const initialTasks = [
  { id: 1, title: 'Learn backend basics', done: true },
  { id: 2, title: 'Build CRUD API', done: false },
  { id: 3, title: 'Push to GitHub', done: false }
];

let tasks = [...initialTasks];

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required and must not be empty' });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((item) => item.id)) + 1 : 1;
  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const payload = req.body;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'Request body must be a non-empty object' });
  }

  const { title, done } = payload;

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'At least one field (title or done) must be provided' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
  }

  if (title !== undefined) {
    task.title = title.trim();
  }

  if (done !== undefined) {
    task.done = done;
  }

  res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
