'use strict'

const { timeslots } = require('../data/build-in.json')
module.exports = {
  async up(queryInterface, Sequelize) {
    const timeslotGroupA = timeslots.slice(0, Math.ceil(timeslots.length / 2))
    const timeslotGroupB = timeslots.slice(Math.ceil(timeslots.length / 2))
    const timeslotPool = [timeslotGroupA, timeslotGroupB]
    const cafes = await queryInterface.sequelize.query(
      'SELECT id FROM Cafes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const timeData = []
    cafes.forEach(cafe => {
      const index = Math.floor(Math.random() * timeslotPool.length)
      timeslotPool[index].forEach(t => timeData.push({
        cafe_id: cafe.id,
        timeslot: t,
        created_at: new Date(),
        updated_at: new Date()
      }))
    })
    await queryInterface.bulkInsert('Times', timeData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Times', {})
  }
}
