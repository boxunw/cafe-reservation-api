const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const userServices = {
  signUp: (req, cb) => {
    const { name, email, password } = req.body
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          const error = new Error('The email has already been registered!')
          error.statusCode = 409
          error.isExpected = true
          throw error
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(newUser => {
        newUser = newUser.toJSON()
        delete newUser.password
        return cb(null, newUser)
      })
      .catch(err => cb(err))
  },
  login: (req, cb) => {
    try {
      const { password, role, ...userData } = getUser(req).toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      userData.token = token
      return cb(null, userData)
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = userServices
