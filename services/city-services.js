const { City } = require('../models')
const cityServices = {
  getCities: (req, cb) => {
    return City.findAll({ raw: true })
      .then(cities => {
        const newCities = cities.map(c => c.city)
        return cb(null, newCities)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
}
module.exports = cityServices
