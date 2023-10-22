const passport = require('../config/passport')
const { getUser } = require('../helpers/auth-helper')

// verify if the request holds a previously issued token and is from an existed user
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Not yet logged in!' })
    req.user = user // after successful verification, assign the user to req.user
    next()
  })(req, res, next)
}

// Verification must be in the role of an admin to access the backstage
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Account does not exist!' })
}

// Verification must be in the role of an user to access the forestage
const authenticatedUser = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'Account does not exist!' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
