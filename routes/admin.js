const express = require('express');
const router = express.Router();
const authController = require('../specs/admin');

router.get('/', authController.getAdmin);
router.get('/universities', authController.getUniversities);
router.post('/add-university', authController.postAddCollege)

module.exports = router;