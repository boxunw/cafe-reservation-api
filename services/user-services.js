const bcrypt = require('bcryptjs')
const { User } = require('../models')
const userServices = {
  signUp: (req, cb) => {
    const { name, email, password } = req.body
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          const error = new Error('The email has already been registered!')
          error.statusCode = 409
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
  }
}
module.exports = userServices
