const { Op } = require('sequelize')
const sequelize = require('../models').sequelize // Make sure to import the sequelize instance exported from the index.js in the models folder, not the sequelize module itself.
const { Cafe, City, User, Reservation, Favorite, Time, Table } = require('../models')
const adminServices = {
  getCafes: (req, cb) => {
    return Cafe.findAll({
      include: [
        { model: City, attributes: ['city'] },
        { model: User, attributes: ['name'] }
      ],
      order: [
        [User, 'name', 'ASC'],
        ['createdAt', 'DESC'],
        ['name', 'ASC']
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
  deleteOldResvs: async (req, cb) => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      await sequelize.transaction(async t => {
        await Reservation.destroy({
          where: { date: { [Op.lt]: today } },
          transaction: t
        })
      })
      cb(null)
    } catch (err) {
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      cb(genericError)
    }
  },
  deleteCafe: async (req, cb) => {
    const cafeId = req.params.id
    try {
      // Use managed transaction to ensure rolling back in case an error occurs
      await sequelize.transaction(async t => {
        const cafe = await Cafe.findByPk(cafeId)
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        await Time.destroy({
          where: { cafeId },
          transaction: t
        })
        await Table.destroy({
          where: { cafeId },
          transaction: t
        })
        await Reservation.destroy({
          where: { cafeId },
          transaction: t
        })
        await Favorite.destroy({
          where: { cafeId },
          transaction: t
        })
        await cafe.destroy({ transaction: t })
      })
      cb(null)
    } catch (err) {
      if (err.isExpected) {
        return cb(err)
      }
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      cb(genericError)
    }
  }
}
module.exports = adminServices
