// Custom middleware to log whenever a new Todo is added
function logTodoCreation(req, res, next) {
  if (req.method === 'POST' && req.body && req.body.text) {
    console.log(`[TODO ACTION] The frontend is adding a new task: "${req.body.text}"`);
  }
  next();
}

module.exports = logTodoCreation;
