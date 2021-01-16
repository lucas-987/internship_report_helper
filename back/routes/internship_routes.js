const express = require('express')
const router = express.Router()
const controller = require('../controllers/internship_controller')

// Get all internships
router.get('/', controller.getAllInternships);

// Get internship by id
router.get('/:id', controller.getInternshipById);

// Create internship
router.post('/', controller.createInternship);

// Update internship
router.put('/:id', controller.updateInternship);

// Delete internship
router.delete('/:id', controller.deleteInternship);

module.exports = router;