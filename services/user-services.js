const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
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
  },
  putAccount: (req, cb) => {
    const userId = req.params.id
    const { name, email, password } = req.body
    return User.findByPk(userId)
      .then(async user => {
        if (!user) {
          const error = new Error('Account does not exist!')
          error.statusCode = 404
          throw error
        }
        const user1 = await User.findOne({
          where: {
            [Op.and]: [
              { email },
              { id: { [Op.ne]: userId } }
            ]
          }
        })
        return [user, user1]
      })
      .then(([user, user1]) => {
        if (user1) {
          const error = new Error('The email has already been registered!')
          error.statusCode = 409
          throw error
        }
        return user.update({
          name,
          email,
          password: password ? bcrypt.hashSync(password, 10) : user.password
        })
      })
      .then(user => {
        user = user.toJSON()
        delete user.password
        delete user.role
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const userId = req.params.id
    return User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
      raw: true
    })
      .then(user => {
        if (!user) {
          const error = new Error('Account does not exist!')
          error.statusCode = 404
          throw error
        }
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices
