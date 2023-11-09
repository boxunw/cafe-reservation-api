'use strict'

const { seats, counts } = require('../data/build-in.json')
module.exports = {
  async up(queryInterface, Sequelize) {
    const cafes = await queryInterface.sequelize.query(
      'SELECT id FROM Cafes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tableData = []
    cafes.forEach(cafe => {
      const seatData = seats.slice() // copy seats to seatData
      for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * seatData.length)
        const seat = seatData.splice(index, 1)[0]
        tableData.push({
          cafe_id: cafe.id,
          seat,
          count: counts[Math.floor(Math.random() * counts.length)],
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Tables', tableData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tables', {})
  }
}
