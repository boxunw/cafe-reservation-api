const userServices = require('../services/user-services')
const { getUser } = require('../helpers/auth-helper')
const userController = {
  signUp: (req, res, next) => {
    const { name, email, password, checkPassword } = req.body
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password cannot be empty!')
      error.statusCode = 400
      throw error
    }
    if (name.length > 50) {
      const error = new Error('The name exceeds the maximum character limit of 50!')
      error.statusCode = 422
      throw error
    }
    if (password !== checkPassword) {
      const error = new Error('The passwords do not match!')
      error.statusCode = 422
      throw error
    }
    userServices.signUp(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Registration successful!',
        ...data
      }))
  },
  login: (req, res, next) => {
    userServices.login(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Login successful!',
        ...data
      }))
  },
  putAccount: (req, res, next) => {
    const userId = req.params.id
    if (Number(userId) !== getUser(req).id) {
      const error = new Error("Only able to edit the logged-in user's own account!")
      error.statusCode = 403
      throw error
    }
    const { name, email, password, checkPassword } = req.body
    if (!name || !email) {
      const error = new Error('Name and email cannot be empty!')
      error.statusCode = 400
      throw error
    }
    if (name.length > 50) {
      const error = new Error('The name exceeds the maximum character limit of 50!')
      error.statusCode = 422
      throw error
    }
    if (password !== checkPassword) {
      const error = new Error('The passwords do not match!')
      error.statusCode = 422
      throw error
    }
    userServices.putAccount(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Editing successful!',
        ...data
      }))
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    if (Number(userId) !== getUser(req).id) {
      const error = new Error("Only able to get the logged-in user's own account data!")
      error.statusCode = 403
      throw error
    }
    userServices.getUser(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        ...data
      }))
  }
}
module.exports = userController
