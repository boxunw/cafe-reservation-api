const cafeServices = require('../services/cafe-services')
const cafeController = {
  postCafe: (req, res, next) => {
    const { city, name, intro, description, address, tel } = req.body
    if (!city || !name || !intro || !description || !address || !tel) {
      const error = new Error('Name, city, cover, intro, description, address and tel cannot be empty!')
      error.statusCode = 400
      throw error
    }
    if (!req.files || !req.files.cover) {
      const error = new Error('Name, city, cover, intro, description, address and tel cannot be empty!')
      error.statusCode = 400
      throw error
    }
    if (name.length > 50) {
      const error = new Error('The intro exceeds the maximum character limit of 100!')
      error.statusCode = 422
      throw error
    }
    if (intro.length > 100) {
      const error = new Error('The intro exceeds the maximum character limit of 100!')
      error.statusCode = 422
      throw error
    }
    if (description.length > 300) {
      const error = new Error('The description exceeds the maximum character limit of 300!')
      error.statusCode = 422
      throw error
    }
    cafeServices.postCafe(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Creation successful!',
        ...data
      }))
  }
}
module.exports = cafeController