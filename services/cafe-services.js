const { Cafe, City } = require('../models')
const { getUser } = require('../helpers/auth-helper')
const imgurFileHandler = require('../helpers/file-helpers')
const cafeServices = {
  postCafe: (req, cb) => {
    const userId = getUser(req).id
    const { city, name, intro, description, address, tel } = req.body
    const { cover, menu1, menu2, menu3, menu4, menu5 } = req.files
    const menufiles = [menu1, menu2, menu3, menu4, menu5].map(menu => menu ? menu[0] : null)
    return Promise.all([
      City.findOne({ where: { city } }),
      imgurFileHandler(cover[0]),
      imgurFileHandler(menufiles[0]),
      imgurFileHandler(menufiles[1]),
      imgurFileHandler(menufiles[2]),
      imgurFileHandler(menufiles[3]),
      imgurFileHandler(menufiles[4])
    ])
      .then(([city, coverPath, menu1Path, menu2Path, menu3Path, menu4Path, menu5Path]) => {
        if (!city) {
          const error = new Error('City does not exist in the list!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
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
  }
}
module.exports = cafeServices
