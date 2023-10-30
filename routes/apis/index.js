const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const times = require('./modules/times')
const cafes = require('./modules/cafes')
const favorites = require('./modules/favorites')
const tables = require('./modules/tables')
const reservations = require('./modules/reservations')
const userController = require('../../controllers/user-controller')
const timeController = require('../../controllers/time-controller')
const cityController = require('../../controllers/city-controller')
const tableController = require('../../controllers/table-controller')
const apiErrorHandler = require('../../middleware/error-handler')
const loginHandler = require('../../middleware/login-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../../middleware/auth')

router.put('/users/:id/account', authenticated, authenticatedUser, userController.putAccount)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.post('/signup', userController.signUp)
router.post('/login', loginHandler, passport.authenticate('local', { session: false }), userController.login)
// router.post('/login', loginHandler, passport.authenticate('local', { session: false }), authenticatedUser, userController.login)

router.get('/cities', cityController.getCities)

// router.post('/admin/login', loginHandler, passport.authenticate('local', { session: false }), authenticatedAdmin, userController.login)
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/times/timeslots', timeController.getTimeslots)
router.get('/times', authenticated, authenticatedUser, times)

router.get('/tables/seats', tableController.getSeats)
router.use('/tables', authenticated, authenticatedUser, tables)

router.use('/cafes', authenticated, authenticatedUser, cafes)
router.use('/favorites', authenticated, authenticatedUser, favorites)
router.use('/reservations', authenticated, authenticatedUser, reservations)

router.use('/', apiErrorHandler)

module.exports = router
