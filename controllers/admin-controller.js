const adminServices = require('../services/admin-services')
const adminController = {
  getCafes: (req, res, next) => {
    adminServices.getCafes(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  deleteOldResvs: (req, res, next) => {
    adminServices.deleteOldResvs(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Deletion successful!'
      }))
  },
  deleteCafe: (req, res, next) => {
    adminServices.deleteCafe(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Deletion successful!'
      }))
  }
}
module.exports = adminController
