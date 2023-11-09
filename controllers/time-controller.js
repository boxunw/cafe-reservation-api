const { timeslots } = require('../data/build-in.json')
const timeServices = require('../services/time-services')
const timeController = {
  getTimeslots: (req, res, next) => {
    try {
      res.json(timeslots)
    } catch (err) {
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      next(genericError)
    }
  },
  postTimes: (req, res, next) => {
    const inputTimeslots = req.body.timeslots
    if (inputTimeslots.length === 0) {
      const error = new Error('There is no input timeslots!')
      error.statusCode = 422
      throw error
    }
    // Confirm that every input timeslot is in the built-in timeslot list.
    if (!inputTimeslots.every(it => timeslots.includes(it))) {
      const error = new Error('Some input timeslots are not within the specified list!')
      error.statusCode = 422
      throw error
    }
    timeServices.postTimes(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Creation successful!'
      }))
  },
  postTime: (req, res, next) => {
    const inputTimeslot = req.body.timeslot
    if (!inputTimeslot || inputTimeslot === '') {
      const error = new Error('There is no input timeslot!')
      error.statusCode = 422
      throw error
    }
    // Confirm that input timeslot is in the built-in timeslot list.
    if (!timeslots.includes(inputTimeslot)) {
      const error = new Error('Input timeslot is not within the specified list!')
      error.statusCode = 422
      throw error
    }
    timeServices.postTime(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Creation successful!'
      }))
  },
  getTimes: (req, res, next) => {
    timeServices.getTimes(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  deleteTime: (req, res, next) => {
    timeServices.deleteTime(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Deletion successful!'
      }))
  }
}
module.exports = timeController
