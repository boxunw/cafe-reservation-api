const apiErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: `${err.message}`
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: `${err}`
    })
  }
  next(err)
}
module.exports = apiErrorHandler
