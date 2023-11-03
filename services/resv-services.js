const { Op } = require('sequelize')
const { Time, Table, Cafe, Reservation, User } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const resvServices = {
  postResv: (req, cb) => {
    const { cafeId, date, timeslot, seat, tel, note } = req.body
    const userId = getUser(req).id
    return Promise.all([
      Time.findOne({ where: { cafeId, timeslot } }),
      Table.findOne({
        where: { cafeId, seat },
        include: { model: Cafe, attributes: ['name'] }
      }),
      Reservation.findOne({ where: { cafeId, userId, date, timeslot } }),
      Reservation.findAll({
        where: { cafeId, date, timeslot, seat },
        attributes: ['id']
      })
    ])
      .then(([time, table, userResv, resvs]) => {
        if (!time) {
          const error = new Error('The cafe is not available for booking during this timeslot!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        if (!table) {
          const error = new Error('The cafe does not have this type of seating!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        if (userResv) {
          const error = new Error('You already have a reservation for that timeslot!')
          error.statusCode = 409
          error.isExpected = true
          throw error
        }
        if (resvs.length >= table.count) {
          const error = new Error('This seat has no available tables!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        const tablePromise = new Promise(resolve => {
          resolve(table)
        })
        return Promise.all([
          tablePromise,
          Reservation.create({
            cafeId,
            userId,
            date,
            timeslot,
            seat,
            tel,
            note
          })
        ])
      })
      .then(([table, newResv]) => {
        const { id, cafeId, userId, createdAt, updatedAt, ...data } = newResv.toJSON()
        return cb(null, {
          cafe: table.Cafe.name,
          ...data
        })
      })
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  getResvs: (req, cb) => {
    const userId = getUser(req).id
    const today = new Date().toISOString().slice(0, 10)
    return Reservation.findAll({
      where: {
        userId,
        // Only reservation information for dates starting from today will be retrieved
        date: { [Op.gte]: today }
      },
      order: [['date', 'ASC'], ['timeslot', 'ASC'], ['seat', 'ASC']],
      include: { model: Cafe, attributes: ['name'] }
    })
      .then(resvs => {
        const data = resvs.map(resv => ({
          id: resv.id,
          cafeId: resv.cafeId,
          cafe: resv.Cafe.name,
          date: resv.date,
          timeslot: resv.timeslot,
          seat: resv.seat,
          tel: resv.tel,
          note: resv.note
        }))
        return cb(null, data)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  getCafeResvs: (req, cb) => {
    const cafeId = req.params.cafeId
    const userId = getUser(req).id
    const today = new Date().toISOString().slice(0, 10)
    return Promise.all([
      Cafe.findByPk(cafeId, { attributes: ['userId'] }),
      Reservation.findAll({
        where: {
          cafeId,
          // Only reservation information for dates starting from today will be retrieved
          date: { [Op.gte]: today }
        },
        order: [['date', 'ASC'], ['timeslot', 'ASC'], ['seat', 'ASC']],
        include: [
          { model: Cafe, attributes: ['name'] },
          { model: User, attributes: ['name', 'email'] }
        ]
      })
    ])
      .then(([cafe, resvs]) => {
        if (cafe.userId !== userId) {
          const error = new Error("Only able to get reservations for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        const data = resvs.map(resv => ({
          id: resv.id,
          cafe: resv.Cafe.name,
          customer: resv.User.name,
          email: resv.User.email,
          date: resv.date,
          timeslot: resv.timeslot,
          seat: resv.seat,
          tel: resv.tel,
          note: resv.note
        }))
        return cb(null, data)
      })
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  deleteResv: (req, cb) => {
    const resvId = req.params.id
    const userId = getUser(req).id
    return Reservation.findByPk(resvId, {
      include: { model: Cafe, attributes: ['userId'] }
    })
      .then(resv => {
        if (resv.Cafe.userId !== userId) {
          const error = new Error("Only able to delete reservation for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        return resv.destroy()
      })
      .then(() => cb(null))
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
}
module.exports = resvServices
