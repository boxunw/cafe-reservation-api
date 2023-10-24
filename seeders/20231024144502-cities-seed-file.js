'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cities', [{
      city: 'Taipei',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      city: 'Hsinchu',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      city: 'Taichung',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      city: 'Chiayi',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      city: 'Tainan',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      city: 'Kaohsiung',
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', {})
  }
}
