const resvServices = require('../services/resv-services')
const resvController = {
  postResv: (req, res, next) => {
    const { cafeId, date, timeslot, seat, tel } = req.body
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
    resvServices.postResv(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Reservation successful!',
        ...data
      }))
  }
}
module.exports = resvController
