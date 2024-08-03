const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const checkLoggedin = require('../middlewares/checkLoggedin');

/* GET home page. */
router.get('/', postController.getAllPosts);
router.post('/post', checkLoggedin, postController.postCreatePost);
router.post('/post/:id/delete', checkLoggedin, postController.postDeletePost);

module.exports = router;
