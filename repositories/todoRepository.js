// The repository handles all database queries.
class TodoRepository {
  constructor(db) {
    this.db = db; // Dependency Injection: the database pool is injected
  }

  async getAll() {
    const result = await this.db.query('SELECT * FROM todos ORDER BY id ASC');
    return result.rows;
  }

  async add(text) {
    const result = await this.db.query(
      'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
      [text, false]
    );
    return result.rows[0];
  }

  async toggle(id) {
    // Find current state
    const current = await this.db.query('SELECT completed FROM todos WHERE id = $1', [id]);
    if (current.rows.length === 0) return null;

    const newState = !current.rows[0].completed;
    const result = await this.db.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [newState, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = TodoRepository;
