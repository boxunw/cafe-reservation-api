const loginHandler = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    const error = new Error('email, and password cannot be empty!')
    error.statusCode = 400
    throw error
  }
  return next()
}
module.exports = loginHandler
