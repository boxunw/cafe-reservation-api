const express = require('express')
const router = express.Router()
const cafeController = require('../../../controllers/cafe-controller')

router.post('/', cafeController.postCafe)

module.exports = router
