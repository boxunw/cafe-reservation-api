const timeServices = require('../services/time-services')
const timeController = {
  getTimes: (req, res, next) => {
    timeServices.getTimes(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = timeController
