// The controller handles HTTP requests and responses.
// It relies on the repository (Dependency Injection).
class TodoController {
  constructor(repository) {
    this.repository = repository;
  }

  // Get all todos
  getAllTodos = async (req, res) => {
    try {
      const todos = await this.repository.getAll();
      res.json(todos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  };

  // Add a new todo
  addTodo = async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Text is required" });
      
      const newTodo = await this.repository.add(text);
      res.json({ success: true, todo: newTodo });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add todo" });
    }
  };

  // Toggle todo completion
  toggleTodo = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedTodo = await this.repository.toggle(id);
      
      if (updatedTodo) {
        res.json({ success: true, todo: updatedTodo });
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update todo" });
    }
  };

  // Delete a todo
  deleteTodo = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.repository.delete(id);
      
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete todo" });
    }
  };
}

module.exports = TodoController;
