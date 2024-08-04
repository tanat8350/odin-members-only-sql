const { body, validationResult } = require('express-validator');
const passport = require('passport');
const asyncHandler = require('express-async-handler');

const authenticateQueries = require('../db/authenticateQueries');

const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
  res.render('signup', { title: 'Sign up' });
};

exports.postSignup = [
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
    .custom(async (value) => {
      const user = await authenticateQueries.getUserByEmail(value);
      if (user) {
        throw new Error('Email already in use');
        // return Promise.reject('Email already in use');
      }
    })
    .escape(),
  body('password')
    .isLength({ min: 3, max: 100 })
    .withMessage('Password must be between 3 and 100 characters'),
  body('passwordConfirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password are not identical'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    };

    if (!errors.isEmpty()) {
      res.render('signup', {
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
      req.body.password = hashedPassword;
      const updated = await authenticateQueries.createUser({
        ...user,
        password: req.body.password,
      });
      if (!updated) {
        return next({ status: 404, message: 'Fail to create user' });
      }
      res.redirect('/');
    });
  }),
];

exports.getLogin = (req, res, next) => {
  let error;
  const email = req.session.lastEmail;
  const messages = req.session.messages;
  if (messages) {
    error = [
      {
        msg: messages[messages.length - 1],
      },
    ];
  }

  delete req.session.messages;
  delete req.session.lastEmail;
  console.log(req.session);
  res.render('login', {
    title: 'Login',
    errors: error,
    email,
  });
};
exports.setLastEmail = (req, res, next) => {
  req.session.lastEmail = req.body.email;
  next();
};

exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true,
  // failWithError: true,
});

exports.getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.getUpdateMembership = (req, res, next) => {
  res.render('member', {
    title: 'Update membership',
    user: req.user,
  });
};

exports.postUpdateMembership = async (req, res, next) => {
  let membership = '';
  if (req.body.code === process.env.CODE_MEMBER) membership = 'member';
  if (req.body.code === process.env.CODE_ADMIN) membership = 'admin';

  const user = {
    id: +req.user.id,
    membership,
  };
  const updated = await authenticateQueries.updateUserMembership(user);
  if (!updated) {
    return next({ status: 404, message: 'Fail to update user membership' });
  }
  res.redirect('/');
};
