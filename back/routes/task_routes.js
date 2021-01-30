const express = require('express');
const router = express.Router();
const controller = require('../controllers/task_controller');

// get all tasks of an internship
router.get('/:internshipId', controller.getAllTasks);

// get a task of an internship by id
router.get('/:internshipId/:taskId', controller.getTask);

// create a new task in an internship
router.post('/:internshipId', controller.createNewTask);

// update task
router.put('/:internshipId/:taskId', controller.updateTask);

// delete task
router.delete('/:internshipId/:taskId', controller.deleteTask);

module.exports = router;