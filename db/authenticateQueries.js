const pool = require('./pool');

module.exports = {
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
