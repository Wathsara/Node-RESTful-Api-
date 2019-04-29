// setup express router
const express = require('express');
const router = module.exports = express.Router();
// import controllers
const controller = require('../controllers/userController');

// user routes
router.post('/new', controller.signup);
router.post('/login', controller.login);
router.post('/post', controller.post);
router.get('/user', controller.getInfo);

