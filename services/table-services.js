const { Cafe, Table } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const tableServices = {
  postTables: (req, cb) => {
    const { cafeId, tables } = req.body
    const userId = getUser(req).id
    return Cafe.findByPk(cafeId, {
      attributes: ['id', 'userId'],
      raw: true,
      nest: true
    })
      .then(cafe => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (cafe.userId !== userId) {
          const error = new Error("Only able to create tables for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        const tablePromises = tables.map(t => {
          return Table.findOne({ where: { cafeId, seat: t.seat } })
            .then(table => {
              if (table) {
                return table.update({ count: t.count })
              } else {
                return Table.create({ cafeId, seat: t.seat, count: t.count })
              }
            })
        })
        return Promise.all(tablePromises)
      })
      .then(() => cb(null)
      )
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  postTable: (req, cb) => {
    const { cafeId, seat, count } = req.body
    const userId = getUser(req).id
    return Promise.all([
      Cafe.findByPk(cafeId, { attributes: ['id', 'userId'] }),
      Table.findOne({ where: { cafeId, seat } })
    ])
      .then(([cafe, table]) => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (cafe.userId !== userId) {
          const error = new Error("Only able to create table for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        if (table) {
          const error = new Error('Seat already exists!')
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        return Table.create({ cafeId, seat, count })
      })
      .then(() => cb(null)
      )
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

module.exports = tableServices
