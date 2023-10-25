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

router.post('/', uploadImages, cafeController.postCafe)

module.exports = router
