const favoriteServices = require('../services/favorite-services')
const favoriteController = {
  postFavorite: (req, res, next) => {
    favoriteServices.postFavorite(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Favoriting successful!'
      }))
  }
}
module.exports = favoriteController
