const { seats } = require('../data/build-in.json')
const tableServices = require('../services/table-services')
const tableController = {
  getSeats: (req, res, next) => {
    try {
      res.json(seats)
    } catch (err) {
      console.error(err.message)
      const genericError = new Error('An internal server error occurred!')
      next(genericError)
    }
  },
  postTables: (req, res, next) => {
    const { tables } = req.body
    if (tables.length === 0) {
      const error = new Error('There is no input seat and count!')
      error.statusCode = 422
      throw error
    }
    tables.forEach(table => {
      if (!table.seat || table.seat === '') {
        const error = new Error('Seat type cannot be empty!')
        error.statusCode = 422
        throw error
      }
      if (!table.count || table.count === '' || Number(table.count) === 0) {
        const error = new Error('Table Count cannot be empty or zero!')
        error.statusCode = 422
        throw error
      }
    })
    // Confirm that every input seat is in the built-in seat list.
    if (!tables.every(table => seats.includes(table.seat))) {
      const error = new Error('Some input seat types are not within the specified list!')
      error.statusCode = 422
      throw error
    }
    tableServices.postTables(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Creation successful!'
      }))
  },
  postTable: (req, res, next) => {
    const { seat, count } = req.body
    if (!seat || seat === '') {
      const error = new Error('Seat type cannot be empty!')
      error.statusCode = 422
      throw error
    }
    if (!count || count === '' || Number(count) === 0) {
      const error = new Error('Table Count cannot be empty or zero!')
      error.statusCode = 422
      throw error
    }
    // Confirm that input seat is in the built-in seat list.
    if (!seats.includes(seat)) {
      const error = new Error('Input seat is not within the specified list!')
      error.statusCode = 422
      throw error
    }
    tableServices.postTable(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Creation successful!'
      }))
  },
  getTables: (req, res, next) => {
    tableServices.getTables(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  putTable: (req, res, next) => {
    const { count } = req.body
    if (!count || count === '' || Number(count) === 0) {
      const error = new Error('Table Count cannot be empty or zero!')
      error.statusCode = 422
      throw error
    }
    tableServices.putTable(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        ...data
      }))
  },
  deleteTable: (req, res, next) => {
    tableServices.deleteTable(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Deletion successful!'
      }))
  }
}

module.exports = tableController
