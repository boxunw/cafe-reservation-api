'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Times', [{
      timeslot: '1000',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1100',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1200',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1300',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1400',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1500',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1600',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1700',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      timeslot: '1800',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Times', {})
  }
}
