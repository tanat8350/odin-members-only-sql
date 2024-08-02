const pool = require('./pool');

module.exports = {
  getAllPosts: async () => {
    const query = {
      text: 'SELECT *, posts.id as postid FROM posts join users on posts.userid = users.id order by timestamp desc',
    };
    const { rows } = await pool.query(query);
    return rows;
  },

  createPost: async (post) => {
    const { title, content, userid } = post;
    const query = {
      text: 'INSERT INTO posts (title, content, userid) VALUES ($1, $2, $3) RETURNING *',
      values: [title, content, userid],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },

  deletePost: async (id) => {
    const query = {
      text: 'DELETE FROM posts WHERE id = $1 RETURNING *',
      values: [id],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },
};
