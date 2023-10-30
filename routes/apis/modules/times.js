const express = require('express')
const router = express.Router()
const timeController = require('../../../controllers/time-controller')

router.post('/bulk', timeController.postTimes)

module.exports = router
