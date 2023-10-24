const cityServices = require('../services/city-services')
const cityController = {
  getCities: (req, res, next) => {
    cityServices.getCities(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = cityController
