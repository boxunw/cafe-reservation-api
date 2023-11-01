const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

router.get('/cafes', adminController.getCafes)

module.exports = router
