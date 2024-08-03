const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const postQueries = require('../db/postQueries');

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  delete req.session.lastEmail;
  console.log(req.isAuthenticated());
  const posts = await postQueries.getAllPosts();

  res.render('index', {
    title: 'Home',
    user: req.user,
    posts,
  });
});

exports.postCreatePost = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required')
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const form = {
      title: req.body.title,
      content: req.body.content,
      userid: req.user.id,
    };

    if (!errors.isEmpty()) {
      const posts = await postQueries.getAllPosts();
      res.render('index', {
        form,
        posts,
        user: req.user,
        errors: errors.array(),
      });
      return;
    }

    const created = await postQueries.createPost(form);
    if (!created) {
      return next({ status: 404, message: 'Fail to create post' });
    }
    res.redirect('/');
  }),
];

exports.postDeletePost = asyncHandler(async (req, res, next) => {
  const deleted = await postQueries.deletePost(req.params.id);
  if (!deleted) {
    return next({ status: 404, message: 'Fail to delete post' });
  }
  res.redirect('/');
});
