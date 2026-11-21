const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

const initialTasks = [
  { id: 1, title: 'Learn backend basics', done: true },
  { id: 2, title: 'Build CRUD API', done: false },
  { id: 3, title: 'Push to GitHub', done: false }
];

let tasks = [...initialTasks];

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
