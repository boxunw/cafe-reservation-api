const express = require('express')
const router = express.Router()
const timeController = require('../../../controllers/time-controller')

router.post('/bulk', timeController.postTimes)
router.delete('/:id', timeController.deleteTime)
router.post('/', timeController.postTime)
router.get('/', timeController.getTimes)
module.exports = router
