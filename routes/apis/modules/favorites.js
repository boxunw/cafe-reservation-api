const express = require('express')
const router = express.Router()
const favoriteController = require('../../../controllers/favorite-controller')

router.post('/:cafeId', favoriteController.postFavorite)

module.exports = router
