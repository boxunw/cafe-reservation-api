const favoriteServices = require('../services/favorite-services')
const favoriteController = {
  postFavorite: (req, res, next) => {
    favoriteServices.postFavorite(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Favoriting successful!'
      }))
  },
  deleteFavorite: (req, res, next) => {
    favoriteServices.deleteFavorite(req, err => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'Unfavoriting successful!'
      }))
  },
  getFavoriteCafes: (req, res, next) => {
    favoriteServices.getFavoriteCafes(req, (err, data) => err
      ? next(err)
      : res.json(data))
  }
}
module.exports = favoriteController
