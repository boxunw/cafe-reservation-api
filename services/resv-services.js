const { Time, Table, Cafe, Reservation } = require('../models')
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
      Reservation.findAll({
        where: { cafeId, date, timeslot, seat },
        attributes: ['id']
      })
    ])
      .then(([time, table, resvs]) => {
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
        if (resvs.length >= table.count) {
          const error = new Error('This seat type has no available tables for reservation!')
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
        const { id, createdAt, updatedAt, ...data } = newResv.toJSON()
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
  }
}
module.exports = resvServices
