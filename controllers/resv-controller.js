const resvServices = require('../services/resv-services')
const resvController = {
  postResv: (req, res, next) => {
    const { cafeId, date, timeslot, seat, tel } = req.body
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!cafeId) {
      const error = new Error('Coffee shop not selected yet!')
      error.statusCode = 422
      throw error
    }
    if (!date || !timeslot || !seat || !tel) {
      const error = new Error('Date, timeslot, seat and tel cannot be empty!')
      error.statusCode = 400
      throw error
    }
    if (!datePattern.test(date)) {
      const error = new Error("The date format should be in the format 'xxxx-xx-xx'!")
      error.statusCode = 400
      throw error
    }
    resvServices.postResv(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Reservation successful!',
        ...data
      }))
  },
  getResvs: (req, res, next) => {
    resvServices.getResvs(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  getCafeResvs: (req, res, next) => {
    resvServices.getCafeResvs(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  deleteResv: (req, res, next) => {
    resvServices.deleteResv(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Deletion successful!'
      }))
  }
}
module.exports = resvController
