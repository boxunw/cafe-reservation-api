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
  },
  getTables: (req, cb) => {
    const cafeId = req.params.cafeId
    const userId = getUser(req).id
    return Cafe.findByPk(cafeId, { attributes: ['id', 'userId'] })
      .then(cafe => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (cafe.userId !== userId) {
          const error = new Error("Only able to get tables for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        return Table.findAll({
          where: { cafeId },
          attributes: ['id', 'seat', 'count'],
          order: [['seat', 'ASC']]
        })
      })
      .then(tables => cb(null, tables))
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  putTable: (req, cb) => {
    const tableId = req.params.id
    const { count } = req.body
    const userId = getUser(req).id
    return Table.findByPk(tableId, {
      include: { model: Cafe, attributes: ['userId'] }
    })
      .then(table => {
        if (!table) {
          const error = new Error('Seat type does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (table.Cafe.userId !== userId) {
          const error = new Error("Only able to edit count for the user's own cafe seat!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        return table.update({ count })
      })
      .then(newTable => {
        const { Cafe, createdAt, updatedAt, ...data } = newTable.toJSON()
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
  }
}

module.exports = tableServices
