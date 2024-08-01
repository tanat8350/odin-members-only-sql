const express = require('express');
const router = express.Router();

const authenticateController = require('../controllers/authenticateController');

router.get('/sign-up', authenticateController.signUp_get);
router.post('/sign-up', authenticateController.signUp_post);

router.get('/login', authenticateController.login_get);
router.post('/login', authenticateController.login_post);

router.get('/logout', authenticateController.logout);

router.get('/member', authenticateController.member_get);
router.post('/member', authenticateController.member_post);

module.exports = router;
