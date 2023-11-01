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
      if (!table.count || table.count === '') {
        const error = new Error('Table Count cannot be empty!')
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
  }
}

module.exports = tableController
