const { Op } = require('sequelize')
const { Cafe, City, User, Reservation } = require('../models')
const adminServices = {
  getCafes: (req, cb) => {
    return Cafe.findAll({
      include: [
        { model: City, attributes: ['city'] },
        { model: User, attributes: ['name'] }
      ],
      order: [
        [User, 'name', 'ASC'],
        ['createdAt', 'DESC']
      ],
      raw: true,
      nest: true
    })
      .then(cafes => {
        const cafesData = cafes.map(cafe => ({
          id: cafe.id,
          user: cafe.User.name,
          name: cafe.name,
          cover: cafe.cover,
          intro: cafe.intro,
          city: cafe.City.city
        }))
        return cb(null, cafesData)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  deleteOldResvs: (req, cb) => {
    const today = new Date().toISOString().slice(0, 10)
    return Reservation.destroy({
      where: {
        date: { [Op.lt]: today }
      }
    })
      .then(() => cb(null))
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
}
module.exports = adminServices
