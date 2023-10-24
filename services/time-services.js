const { Time } = require('../models')
const timeServices = {
  getTimes: (req, cb) => {
    return Time.findAll({ raw: true })
      .then(times => {
        const newTimes = times.map(t => t.timeslot).sort()
        return cb(null, newTimes)
      })
      .catch(err => cb(err))
  }
}
module.exports = timeServices
