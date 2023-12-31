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
      const error = new Error('The name exceeds the maximum character limit of 50!')
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
  },
  putCafe: (req, res, next) => {
    const { city, name, intro, description, address, tel } = req.body
    if (!city || !name || !intro || !description || !address || !tel) {
      const error = new Error('Name, city, cover, intro, description, address and tel cannot be empty!')
      error.statusCode = 400
      throw error
    }
    if (name.length > 50) {
      const error = new Error('The name exceeds the maximum character limit of 50!')
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
    cafeServices.putCafe(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Editing successful!',
        ...data
      }))
  },
  getAllCafes: (req, res, next) => {
    cafeServices.getAllCafes(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  getCafe: (req, res, next) => {
    cafeServices.getCafe(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        ...data
      }))
  },
  getOwnCafes: (req, res, next) => {
    cafeServices.getOwnCafes(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  postSearch: (req, res, next) => {
    const { date } = req.body
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!datePattern.test(date)) {
      const error = new Error("The date format should be in the format 'xxxx-xx-xx'!")
      error.statusCode = 400
      throw error
    }
    cafeServices.postSearch(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  postEmptyTime: (req, res, next) => {
    const { startDate } = req.body
    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!datePattern.test(startDate)) {
      const error = new Error("The startDate format should be in the format 'xxxx-xx-xx'!")
      error.statusCode = 400
      throw error
    }
    cafeServices.postEmptyTime(req, (err, data) => err
      ? next(err)
      : res.json(data))
  }
}
module.exports = cafeController
