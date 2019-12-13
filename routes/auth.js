const express = require('express');
const router = express.Router();
const authController = require('../specs/auth');

router.get('/signup', authController.getSignup);
router.get('/get/universities', authController.getUniversities);
router.get('/login', authController.getLogin);
router.get('/verify/:token', authController.getVerify);
router.get('/check/username', authController.checkUsername);
router.get('/reset', authController.getForgot);
router.get('/reset/:token', authController.getReset);
router.get('/error', authController.getError);
router.get('/get/subjects', authController.getSubjects);

router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/finish-signup', authController.finish_signup);
router.post('/reset', authController.resetPassword);
router.post('/new-password', authController.postNewPassword);
router.get('/verify/:token', authController.postVerify);
router.post('/signout', authController.postSignout);

module.exports = router;