const express = require('express')
const router = express.Router()
const controller = require('../controllers/InternshipController.js')

// Get all Internships
router.get('/', controller.getAllInternships)

// Get Internship by id
router.get('/:id', controller.getInternship)

// Create Internship
router.post('/', controller.createInternship)

// Update Internship
router.put('/:id', controller.updateInternship)

// Delete Internship
router.delete('/:id', controller.deleteInternship)

module.exports = router