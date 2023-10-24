const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const cafes = require('./modules/cafes')
const favorites = require('./modules/favorites')
const tables = require('./modules/tables')
const reservations = require('./modules/reservations')
const userController = require('../../controllers/user-controller')
const timeController = require('../../controllers/time-controller')
const cityController = require('../../controllers/city-controller')
const apiErrorHandler = require('../../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../../middleware/auth')

router.put('/users/:id/account', authenticated, authenticatedUser, userController.putAccount)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.post('/signup', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), authenticatedUser, userController.login)

router.get('/times', timeController.getTimes)
router.get('/cities', cityController.getCities)

router.post('/admin/login', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.login)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/cafes', authenticated, authenticatedUser, cafes)
router.use('/favorites', authenticated, authenticatedUser, favorites)
router.use('/tables', authenticated, authenticatedUser, tables)
router.use('/reservations', authenticated, authenticatedUser, reservations)

router.use('/', apiErrorHandler)

module.exports = router
