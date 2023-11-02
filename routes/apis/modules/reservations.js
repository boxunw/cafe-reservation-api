const express = require('express')
const router = express.Router()
const resvController = require('../../../controllers/resv-controller')

router.post('/', resvController.postResv)

module.exports = router
