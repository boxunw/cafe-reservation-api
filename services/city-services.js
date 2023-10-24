const { City } = require('../models')
const cityServices = {
  getCities: (req, cb) => {
    return City.findAll({ raw: true })
      .then(cities => {
        const newCities = cities.map(c => c.city)
        return cb(null, newCities)
      })
      .catch(err => cb(err))
  }
}
module.exports = cityServices
