const express = require('express');
const router = express.Router();
const controller = require('../controllers/action_controller');

// get all actions of a task
router.get('/:internshipId/:taskId', controller.getAllActions);

// get action of a task by id
router.get('/:internshipId/:taskId/:actionId', controller.getAction);

// create a new action in a task
router.post('/:internshipId/:taskId', controller.createNewAction);

// update action
router.put('/:internshipId/:taskId/:actionId', controller.updateAction);

// delete action
router.delete('/:internshipId/:taskId/:actionId', controller.deleteAction);

module.exports = router;