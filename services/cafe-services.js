const { Cafe, City, User, Time, Table, Reservation } = require('../models')
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
      attributes: ['id', 'name', 'cover', 'intro', 'description', 'address', 'tel', 'menu1', 'menu2', 'menu3', 'menu4', 'menu5'],
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
  },
  postSearch: async (req, cb) => {
    const { date, timeslot, seat, city } = req.body
    if (!date || !timeslot || !seat) {
      const error = new Error('Date, timeslot and seat cannot be empty!')
      error.statusCode = 400
      error.isExpected = true
      throw error
    }
    // find tables having the seat type
    return Promise.all([
      Table.findAll({
        where: { seat },
        include: {
          model: Cafe,
          attributes: ['id', 'name', 'cover', 'intro'],
          include: [{ model: City }, { model: Time }]
        },
        order: [[Cafe, 'createdAt', 'DESC']]
      }),
      Reservation.findAll({ where: { date, timeslot, seat } })
    ])
      .then(([tables, reservations]) => {
        // find tables whose cafe having the timeslot
        const tablesByTime = []
        tables.forEach(table => {
          if (table.Cafe.Times) {
            const cafeTimeslots = table.Cafe.Times.map(t => t.timeslot)
            if (cafeTimeslots.includes(timeslot)) {
              tablesByTime.push(table)
            }
          }
        })
        // find tables which are avialable at the input date and timeslot
        const tablesByCount = []
        tablesByTime.forEach(tbt => {
          const reservationList = reservations.filter(r => r.cafeId === tbt.cafeId)
          if (tbt.count > reservationList.length) {
            tablesByCount.push(tbt)
          }
        })
        // find tables whose cafe having the same city
        if (city && city !== '') {
          const tablesByCity = tablesByCount.filter(tbc => tbc.Cafe.City.city === city)
          return tablesByCity
        }
        return tablesByCount
      })
      .then(filteredTables => {
        const cafes = filteredTables.map(ft => ({
          id: ft.Cafe.id,
          name: ft.Cafe.name,
          cover: ft.Cafe.cover,
          intro: ft.Cafe.intro,
          city: ft.Cafe.City.city
        }))
        return cb(null, cafes)
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
  postEmptyTime: (req, cb) => {
    const cafeId = req.params.id
    const { seat } = req.body
    // create 7 days arrays from start date
    const startDate = new Date(req.body.startDate) // Convert the date string to a date object
    const dates = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate) // copy startDate to currentDate
      currentDate.setDate(startDate.getDate() + i) // Add i days
      const year = currentDate.getFullYear()
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Month needs zero-padding
      const day = currentDate.getDate().toString().padStart(2, '0') // Day needs zero-padding
      const formattedDate = `${year}-${month}-${day}`
      dates.push(formattedDate)
    }
    return Promise.all([
      Table.findOne({
        where: { cafeId, seat },
        include: {
          model: Cafe,
          attributes: ['id'],
          include: { model: Time }
        }
      }),
      Reservation.findAll({
        where: { cafeId, seat },
        attributes: ['date', 'timeslot']
      })
    ])
      .then(([table, reservations]) => {
        if (!table) {
          const error = new Error('The coffee shop does not have this seat type!')
          error.statusCode = 422
          error.isExpected = true
          throw error
        }
        const cafeTimeslots = table.Cafe.Times.map(t => t.timeslot)
        cafeTimeslots.sort()
        const replyData = dates.map(date => {
          const timeslots = []
          // filter the available dates and timeslots from the number of reservations
          cafeTimeslots.forEach(t => {
            const reservationsCount = reservations.filter(r => r.date === date && r.timeslot === t).length // the number of reservations filtered by the cafe/seat/date/timeslot
            if (reservationsCount < table.count) {
              timeslots.push(t)
            }
          })
          return {
            date,
            timeslots
          }
        })
        return cb(null, replyData)
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
