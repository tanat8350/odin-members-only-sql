const { body, validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.index = async (req, res, next) => {
  const posts = await Post.find()
    .sort({ timestamp: 1 })
    .populate('author')
    .exec();

  res.render('index', {
    title: 'Home',
    user: req.user,
    posts,
  });
};

exports.post = [
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
  async (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });

    if (!errors.isEmpty()) {
      return;
    }

    await post.save();
    res.redirect('/');
  },
];

exports.post_delete = async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/');
};
