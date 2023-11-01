const express = require('express')
const router = express.Router()
const tableController = require('../../../controllers/table-controller')

router.post('/bulk', tableController.postTables)

module.exports = router
