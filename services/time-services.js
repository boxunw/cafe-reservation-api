const { Cafe, Time } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const timeServices = {
  postTimes: (req, cb) => {
    const { cafeId, timeslots } = req.body
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
          const error = new Error("Only able to create timeslots for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        const timePromises = timeslots.map(t => {
          return Time.findCreateFind({
            where: { cafeId, timeslot: t },
            defaults: { cafeId, timeslot: t } // Insert this value if the record doesn't exist.
          })
        })
        return Promise.all(timePromises)
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
  postTime: (req, cb) => {
    const { cafeId, timeslot } = req.body
    const userId = getUser(req).id
    return Promise.all([
      Cafe.findByPk(cafeId, { attributes: ['id', 'userId'] }),
      Time.findOne({ where: { cafeId, timeslot } })
    ])
      .then(([cafe, time]) => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (cafe.userId !== userId) {
          const error = new Error("Only able to create timeslot for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        if (time) {
          const error = new Error('Timeslot already exists!')
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        return Time.create({ cafeId, timeslot })
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
  getTimes: (req, cb) => {
    const cafeId = req.params.cafeId
    return Cafe.findByPk(cafeId, { attributes: ['id'] })
      .then(cafe => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        return Time.findAll({
          where: { cafeId },
          attributes: ['id', 'timeslot'],
          order: [['timeslot', 'ASC']]
        })
      })
      .then(times => cb(null, times))
      .catch(err => {
        if (err.isExpected) {
          return cb(err)
        }
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  deleteTime: (req, cb) => {
    const timeId = req.params.id
    const userId = getUser(req).id
    return Time.findByPk(timeId, {
      include: { model: Cafe, attributes: ['userId'] }
    })
      .then(time => {
        if (!time) {
          const error = new Error('Timeslot does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (time.Cafe.userId !== userId) {
          const error = new Error("Only able to delete timeslot for the user's own cafe!")
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        return time.destroy()
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
module.exports = timeServices
