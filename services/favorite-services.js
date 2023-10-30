const { Cafe, Favorite, User, City } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const favoriteServices = {
  postFavorite: (req, cb) => {
    const { cafeId } = req.params
    const userId = getUser(req).id
    return Promise.all([
      Cafe.findByPk(cafeId),
      Favorite.findOne({
        where: {
          userId,
          cafeId
        }
      })
    ])
      .then(([cafe, favorite]) => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (favorite) {
          const error = new Error('You have favorited this cafe!')
          error.statusCode = 409
          error.isExpected = true
          throw error
        }
        return Favorite.create({
          userId,
          cafeId
        })
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
  },
  deleteFavorite: (req, cb) => {
    const { cafeId } = req.params
    const userId = getUser(req).id
    return Favorite.findOne({
      where: {
        userId,
        cafeId
      }
    })
      .then(favorite => {
        if (!favorite) {
          const error = new Error('You have not favorited this cafe!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        return favorite.destroy()
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
  },
  getFavoriteCafes: (req, cb) => {
    const userId = getUser(req).id
    return User.findByPk(userId, {
      include: [{
        model: Cafe,
        as: 'FavoritedCafes',
        attributes: ['id', 'name', 'cover', 'intro'],
        order: [['createdAt', 'DESC']],
        include: { model: City }
      }]
    })
      .then(user => {
        const cafes = user.toJSON().FavoritedCafes.map(fc => {
          return {
            id: fc.id,
            name: fc.name,
            cover: fc.cover,
            intro: fc.intro,
            city: fc.City.city
          }
        })
        return cb(null, cafes)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
}
module.exports = favoriteServices
