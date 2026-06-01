// Import the Express library
const express = require('express');
const path = require('path');

// Create a new Express application
const app = express();

// Tell Express to understand JSON data sent in requests
app.use(express.json());

// Tell Express to serve static files from the "public" folder
app.use(express.static('public'));

// This array will hold our todo objects in the server's memory
// Each todo will look like: { id: 1, text: "Buy milk", completed: false }
let todos = [];
let nextId = 1; // Simple way to give each task a unique ID

// Route to send the main HTML page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API route to get all todos
app.get('/api/todos', function(req, res) {
  res.json(todos);
});

// API route to add a new todo
app.post('/api/todos', function(req, res) {
  const newTodoText = req.body.text;
  
  if (newTodoText) {
    const newTask = {
      id: nextId,
      text: newTodoText,
      completed: false
    };
    todos.push(newTask);
    nextId++; // Increase the ID for the next task
  }
  
  res.json({ success: true });
});

// API route to toggle a task as done/undone
app.put('/api/todos/:id', function(req, res) {
  const idToFind = parseInt(req.params.id);
  
  // Find the task in our array
  const task = todos.find(t => t.id === idToFind);
  
  if (task) {
    // Flip the completed status
    task.completed = !task.completed;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// API route to delete a task
app.delete('/api/todos/:id', function(req, res) {
  const idToDelete = parseInt(req.params.id);
  
  // Filter out the task we want to delete
  todos = todos.filter(t => t.id !== idToDelete);
  
  res.json({ success: true });
});

// Start the server and listen on port 8080
const PORT = 8080;
app.listen(PORT, function() {
  console.log('Server is running! Open http://localhost:8080 in your browser.');
});
