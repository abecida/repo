const express = require('express');
const router = express.Router();
const authController = require('../specs/forum');

router.get('/', authController.getMain);
router.get('/post/:postId', authController.getPost);
router.get('/user', authController.getProfile);
router.get('/add-post', authController.getAddPost)

router.post('/post', authController.postPost)
router.post('/save/post/:postId', authController.savePost);

module.exports = router;