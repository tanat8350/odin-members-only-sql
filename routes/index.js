const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

/* GET home page. */
router.get('/', postController.index);
router.post('/post', postController.post);
router.post('/post/:id/delete', postController.post_delete);

module.exports = router;
