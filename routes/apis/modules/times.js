const express = require('express')
const router = express.Router()
const timeController = require('../../../controllers/time-controller')

router.post('/bulk', timeController.postTimes)
router.get('/:cafeId', timeController.getTimes)
router.delete('/:id', timeController.deleteTime)
router.post('/', timeController.postTime)

module.exports = router
