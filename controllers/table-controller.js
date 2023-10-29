const { seats } = require('../data/build-in.json')
const tableController = {
  getSeats: (req, res, next) => {
    try {
      res.json(seats)
    } catch (err) {
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      next(genericError)
    }
  }
}

module.exports = tableController
