const pool = require('./pool');

module.exports = {
  getUserById: async (id) => {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },

  getUserByEmail: async (email) => {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },

  createUser: async (user) => {
    const { firstname, lastname, email, password } = user;
    const query = {
      text: 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [firstname, lastname, email, password],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },

  updateUserMembership: async (user) => {
    const { id, membership } = user;
    const query = {
      text: 'UPDATE users SET membership = $1 WHERE id = $2 RETURNING *',
      values: [membership, id],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },
};
