const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

/* GET home page. */
router.get('/', postController.getAllPosts);
router.post('/post', postController.postCreatePost);
router.post('/post/:id/delete', postController.postDeletePost);

module.exports = router;
