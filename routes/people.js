const express = require('express');
const router = express.Router();
const authController = require('../specs/people');

router.get('/profile', authController.getMyProfile);
router.get('/profile/:userId', authController.getProfile);
router.get('/following/:userId', authController.getFollowing);
router.get('/followers/:userId', authController.getFollowers);

module.exports = router;