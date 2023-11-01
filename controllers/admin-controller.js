const adminServices = require('../services/admin-services')
const adminController = {
  getCafes: (req, res, next) => {
    adminServices.getCafes(req, (err, data) => err
      ? next(err)
      : res.json(data))
  }
}
module.exports = adminController
