const express = require('express');
const path = require('path');
require('dotenv').config();

// Import DB pool, Repository, Controller, and Router
const dbPool = require('./db/database');
const TodoRepository = require('./repositories/todoRepository');
const TodoController = require('./controllers/todoController');
const createTodoRouter = require('./routes/todoRoutes');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// General Request Logger Middleware
app.use(function(req, res, next) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} request made to: ${req.url}`);
  next();
});

// === Dependency Injection Pipeline ===
// 1. Give the DB pool to the Repository
const todoRepo = new TodoRepository(dbPool);
// 2. Give the Repository to the Controller
const todoController = new TodoController(todoRepo);
// 3. Give the Controller to the Router
const todoRouter = createTodoRouter(todoController);
// =====================================

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Mount the router under the /api/todos path
app.use('/api/todos', todoRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running! Open http://localhost:${PORT} in your browser.`);
  console.log('Ensure your Postgres database is running via Docker (docker-compose up -d)!');
});
