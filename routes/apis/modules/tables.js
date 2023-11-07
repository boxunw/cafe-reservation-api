const express = require('express')
const router = express.Router()
const tableController = require('../../../controllers/table-controller')

router.post('/bulk', tableController.postTables)
router.get('/:cafeId', tableController.getTables)
router.put('/:id', tableController.putTable)
router.delete('/:id', tableController.deleteTable)
router.post('/', tableController.postTable)

module.exports = router
