const { Time } = require('../models')
const timeServices = {
  getTimes: (req, cb) => {
    return Time.findAll({ raw: true })
      .then(times => {
        const newTimes = times.map(t => t.timeslot).sort()
        return cb(null, newTimes)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
}
module.exports = timeServices
