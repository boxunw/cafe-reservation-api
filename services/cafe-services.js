const { Cafe, City, User } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const imgurFileHandler = require('../helpers/file-helpers')
const cafeServices = {
  postCafe: (req, cb) => {
    const userId = getUser(req).id
    const { city, name, intro, description, address, tel } = req.body
    const { cover, menu1, menu2, menu3, menu4, menu5 } = req.files
    const photofiles = [cover, menu1, menu2, menu3, menu4, menu5].map(photo => photo ? photo[0] : null)
    return City.findOne({ where: { city } })
      .then(city => {
        if (!city) {
          const error = new Error('The city is not in the list!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        const cityPromise = new Promise(resolve => {
          resolve(city)
        })
        return Promise.all([
          cityPromise,
          ...photofiles.map(photofile => imgurFileHandler(photofile))
        ])
      })
      .then(([city, coverPath, menu1Path, menu2Path, menu3Path, menu4Path, menu5Path]) => {
        return Cafe.create({
          userId,
          cityId: city.id,
          name,
          cover: coverPath,
          intro,
          description,
          address,
          tel,
          menu1: menu1Path,
          menu2: menu2Path,
          menu3: menu3Path,
          menu4: menu4Path,
          menu5: menu5Path
        })
      })
      .then(cafe => {
        cafe = cafe.toJSON()
        return cb(null, cafe)
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
  putCafe: (req, cb) => {
    const cafeId = req.params.id
    const { city, name, intro, description, address, tel } = req.body
    const photofiles = ['cover', 'menu1', 'menu2', 'menu3', 'menu4', 'menu5']
      .map(photo => req.files?.[photo] ? req.files[photo][0] : null)
    return Promise.all([
      Cafe.findByPk(cafeId),
      City.findOne({ where: { city } })
    ])
      .then(([cafe, city]) => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        if (cafe.userId !== getUser(req).id) {
          const error = new Error('You can only edit your own coffee shop data!')
          error.statusCode = 403
          error.isExpected = true
          throw error
        }
        if (!city) {
          const error = new Error('The city is not in the list!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        const cafePromise = new Promise(resolve => {
          resolve(cafe)
        })
        const cityPromise = new Promise(resolve => {
          resolve(city)
        })
        return Promise.all([
          cafePromise,
          cityPromise,
          ...photofiles.map(photofile => imgurFileHandler(photofile))
        ])
      })
      .then(([cafe, city, coverPath, menu1Path, menu2Path, menu3Path, menu4Path, menu5Path]) => {
        return cafe.update({
          cityId: city.id,
          name,
          cover: coverPath || cafe.cover,
          intro,
          description,
          address,
          tel,
          menu1: menu1Path || cafe.menu1,
          menu2: menu2Path || cafe.menu2,
          menu3: menu3Path || cafe.menu3,
          menu4: menu4Path || cafe.menu4,
          menu5: menu5Path || cafe.menu5
        })
      })
      .then(cafe => {
        cafe = cafe.toJSON()
        return cb(null, cafe)
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
  getAllCafes: (req, cb) => {
    return Cafe.findAll({
      attributes: ['id', 'name', 'cover', 'intro'],
      include: City,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(cafes => {
        const newCafes = cafes.map(cafe => ({
          id: cafe.id,
          name: cafe.name,
          cover: cafe.cover,
          intro: cafe.intro,
          city: cafe.City.city
        }))
        return cb(null, newCafes)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  },
  getCafe: (req, cb) => {
    const cafeId = req.params.id
    return Cafe.findByPk(cafeId, {
      attributes: ['id', 'name', 'cover', 'description', 'address', 'tel', 'menu1', 'menu2', 'menu3', 'menu4', 'menu5'],
      include: [City, { model: User, as: 'FavoritedUsers' }]
    })
      .then(cafe => {
        if (!cafe) {
          const error = new Error('The coffee shop does not exist!')
          error.statusCode = 404
          error.isExpected = true
          throw error
        }
        const newCafe = {
          ...cafe.toJSON(),
          city: cafe.City.city,
          isFavorited: cafe.FavoritedUsers.some(f => f.id === getUser(req).id)
        }
        delete newCafe.City
        delete newCafe.FavoritedUsers
        return cb(null, newCafe)
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
  getOwnCafes: (req, cb) => {
    const userId = getUser(req).id
    return Cafe.findAll({
      where: { userId },
      attributes: ['id', 'name', 'cover', 'intro'],
      include: City,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(cafes => {
        const newCafes = cafes.map(cafe => {
          cafe.city = cafe.City.city
          delete cafe.City
          return cafe
        })
        return cb(null, newCafes)
      })
      .catch(err => {
        console.error(err.message)
        const genericError = new Error('An internal server error occurred!')
        return cb(genericError)
      })
  }
}
module.exports = cafeServices
