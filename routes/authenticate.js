const express = require('express');
const router = express.Router();

const authenticateController = require('../controllers/authenticateController');

router.get('/signup', authenticateController.getSignup);
router.post('/signup', authenticateController.postSignup);

router.get('/login', authenticateController.getLogin);
router.post(
  '/login',
  authenticateController.setLastEmail,
  authenticateController.postLogin
);

router.get('/logout', authenticateController.getLogout);

router.get('/member', authenticateController.getUpdateMembership);
router.post('/member', authenticateController.postUpdateMembership);

module.exports = router;
