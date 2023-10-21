const userServices = require('../services/user-services')
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
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ ...data }))
  }
}
module.exports = userController
