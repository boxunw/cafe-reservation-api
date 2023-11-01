const express = require('express')
const router = express.Router()
const tableController = require('../../../controllers/table-controller')

router.post('/bulk', tableController.postTables)
router.post('/', tableController.postTable)

module.exports = router
