const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// set up Passport Local Strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  // authenticate user
  (email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          const error = new Error('Account does not exist!')
          error.statusCode = 404
          error.isExpected = true
          return cb(error, false)
        }
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) {
              const error = new Error('Incorrect password entered!')
              error.statusCode = 401
              error.isExpected = true
              return cb(error, false)
            }
            return cb(null, user)
          })
      })
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
))

// set up Passport JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => {
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      return cb(genericError)
    })
}))

module.exports = passport
