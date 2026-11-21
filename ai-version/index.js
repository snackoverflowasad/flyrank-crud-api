const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(express.json());

let taskStore = [
  { id: 1, title: 'Learn backend basics', done: true },
  { id: 2, title: 'Build CRUD API', done: false },
  { id: 3, title: 'Push to GitHub', done: false }
];

let currentIdSequence = 3;

const swaggerSpecification = {
  openapi: '3.0.0',
  info: {
    title: 'Task Management API',
    version: '1.0.0'
  },
  paths: {
    '/tasks': {
      get: {
        summary: 'Get all tasks',
        responses: { '200': { description: 'Success' } }
      },
      post: {
        summary: 'Create a task',
        responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' } }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task by id',
        responses: { '200': { description: 'Success' }, '404': { description: 'Not Found' } }
      },
      put: {
        summary: 'Update task',
        responses: { '200': { description: 'Success' }, '400': { description: 'Bad Request' }, '404': { description: 'Not Found' } }
      },
      delete: {
        summary: 'Delete task',
        responses: { '204': { description: 'No Content' }, '404': { description: 'Not Found' } }
      }
    }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  res.json(taskStore);
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskRecord = taskStore.find((t) => t.id === taskId);
  if (!taskRecord) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(taskRecord);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required and must not be empty' });
  }
  currentIdSequence += 1;
  const createdTask = {
    id: currentIdSequence,
    title: title.trim(),
    done: false
  };
  taskStore.push(createdTask);
  res.status(201).json(createdTask);
});

app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = taskStore.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, done } = req.body || {};
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'Invalid payload: title or done must be provided' });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    taskStore[taskIndex].title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
    taskStore[taskIndex].done = done;
  }

  res.json(taskStore[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = taskStore.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  taskStore.splice(taskIndex, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AI version running on http://localhost:${PORT}`);
  });
}

module.exports = app;
