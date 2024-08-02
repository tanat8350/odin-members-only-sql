const { body, validationResult } = require('express-validator');
const passport = require('passport');
const asyncHandler = require('express-async-handler');

const User = require('../models/user');
const authenticateQueries = require('../db/authenticateQueries');

const bcrypt = require('bcryptjs');

exports.signUp_get = (req, res, next) => {
  res.render('sign-up', { title: 'Sign up' });
};

exports.signUp_post = [
  body('firstname')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('First name must be between 3 and 100 characters')
    .isAlpha()
    .withMessage('First name must only contain letters')
    .escape(),
  body('lastname')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Last name must be between 3 and 100 characters')
    .isAlpha()
    .withMessage('Last name must only contain letters')
    .escape(),
  body('email')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Email must be between 3 and 100 characters')
    .isEmail()
    .withMessage('Email invalid format')
    .escape(),
  body('password')
    .isLength({ min: 3, max: 100 })
    .withMessage('Password must be between 3 and 100 characters'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };

    if (!errors.isEmpty()) {
      res.render('sign-up', {
        title: 'Sign up',
        user,
        errors: errors.array(),
      });
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      user.password = hashedPassword;
      const updated = await authenticateQueries.createUser(user);
      if (!updated) {
        return next({ status: 404, message: 'Fail to create user' });
      }
      res.redirect('/');
    });
  }),
];

exports.login_get = (req, res, next) => {
  res.render('login', {
    title: 'Login',
  });
};

exports.login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.member_get = (req, res, next) => {
  res.render('member', {
    title: 'Update membership',
    user: req.user,
  });
};

exports.member_post = async (req, res, next) => {
  let membership = '';
  if (req.body.code === process.env.CODE_MEMBER) membership = 'member';
  if (req.body.code === process.env.CODE_ADMIN) membership = 'admin';

  const user = new User({
    membership,
    _id: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, user);
  res.redirect('/');
};
