const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer')
const cafeController = require('../../../controllers/cafe-controller')
const uploadImages = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'menu1', maxCount: 1 },
  { name: 'menu2', maxCount: 1 },
  { name: 'menu3', maxCount: 1 },
  { name: 'menu4', maxCount: 1 },
  { name: 'menu5', maxCount: 1 }
])

router.get('/owner', cafeController.getOwnCafes)
router.post('/search', cafeController.postSearch)
router.post('/:id/empty', cafeController.postEmptyTime)
router.put('/:id', uploadImages, cafeController.putCafe)
router.get('/:id', cafeController.getCafe)
router.post('/', uploadImages, cafeController.postCafe)
router.get('/', cafeController.getAllCafes)

module.exports = router
