const { timeslots } = require('../data/build-in.json')
const timeServices = require('../services/time-services')
const timeController = {
  getTimeslots: (req, res, next) => {
    try {
      console.log(timeslots)
      res.json(timeslots)
    } catch (err) {
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      next(genericError)
    }
  }
}
module.exports = timeController
