const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const apiErrorHandler = require('../../middleware/error-handler')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

router.put('/users/:id/account', authenticated, authenticatedUser, userController.putAccount)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.post('/signup', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), authenticatedUser, userController.login)
router.use('/', apiErrorHandler)

module.exports = router
