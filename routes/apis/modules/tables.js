const express = require('express')
const router = express.Router()
const tableController = require('../../../controllers/table-controller')

router.post('/bulk', tableController.postTables)
router.post('/', tableController.postTable)
router.get('/', tableController.getTables)

module.exports = router
