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

const defaultSeedTasks = [
  { id: 1, title: 'Learn backend basics', done: true },
  { id: 2, title: 'Build CRUD API', done: false },
  { id: 3, title: 'Push to GitHub', done: false }
];

let tasks = defaultSeedTasks.map((task) => ({ ...task }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks', '/stats', '/reset', '/health', '/docs']
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

app.get('/stats', (req, res) => {
  const total = tasks.length;
  const completed = tasks.filter((item) => item.done === true).length;
  const open = total - completed;

  res.status(200).json({
    total,
    done: completed,
    open
  });
});

app.post('/reset', (req, res) => {
  tasks = defaultSeedTasks.map((task) => ({ ...task }));
  res.status(200).json({
    message: 'Task collection successfully reset to default seed data',
    total: tasks.length
  });
});

app.get('/tasks', (req, res) => {
  const { done, search } = req.query;
  let filteredTasks = [...tasks];

  if (done !== undefined) {
    if (done === 'true') {
      filteredTasks = filteredTasks.filter((item) => item.done === true);
    } else if (done === 'false') {
      filteredTasks = filteredTasks.filter((item) => item.done === false);
    }
  }

  if (search && typeof search === 'string' && search.trim().length > 0) {
    const keyword = search.trim().toLowerCase();
    filteredTasks = filteredTasks.filter((item) => item.title.toLowerCase().includes(keyword));
  }

  res.status(200).json(filteredTasks);
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
