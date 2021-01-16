const express = require('express');
const router = express.Router();
const controller = require('../controllers/task_controller');

// create a new task in an internship
router.post('/:internshipId', controller.createNewTask);

module.exports = router;