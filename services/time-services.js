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
          const error = new Error("Only able to create timeslots for the logged-in user's own cafe!")
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
  }
}
module.exports = timeServices
