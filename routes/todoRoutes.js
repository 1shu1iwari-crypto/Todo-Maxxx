const express = require('express');
const logTodoCreation = require('../middlewares/todoLogger');

// A function that creates the router, accepting the controller as a dependency
function createTodoRouter(controller) {
  const router = express.Router();

  // Apply the specific middleware to log to-do creation only on the POST route
  router.post('/', logTodoCreation, controller.addTodo);
  
  router.get('/', controller.getAllTodos);
  router.put('/:id', controller.toggleTodo);
  router.delete('/:id', controller.deleteTodo);

  return router;
}

module.exports = createTodoRouter;
