const express = require('express')
const router = express.Router()
const controller = require('../controllers/test_controller.js')

router.get('/', controller.test)

module.exports = router;