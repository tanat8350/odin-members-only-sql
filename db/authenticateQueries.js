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
};
