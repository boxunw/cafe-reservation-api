const express = require('express')
const router = express.Router()
const resvController = require('../../../controllers/resv-controller')

router.get('/:cafeId', resvController.getCafeResvs)
router.delete('/:id', resvController.deleteResv)
router.post('/', resvController.postResv)
router.get('/', resvController.getResvs)

module.exports = router
