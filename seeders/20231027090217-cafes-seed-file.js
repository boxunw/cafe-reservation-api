'use strict'
const faker = require('faker')
const { covers, menus } = require('../data/images.json')
module.exports = {
  async up(queryInterface, Sequelize) {
    const cities = await queryInterface.sequelize.query(
      'SELECT id FROM Cities;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const cafeData = []
    users.forEach(user => {
      for (let i = 0; i < 6; i++) {
        cafeData.push({
          user_id: user.id,
          city_id: cities[Math.floor(Math.random() * cities.length)].id,
          name: faker.company.companyName().substring(0, 50),
          cover: covers.shift(),
          intro: faker.lorem.text().substring(0, 100),
          description: faker.lorem.text().substring(0, 300),
          address: faker.address.streetAddress(),
          tel: faker.phone.phoneNumber(),
          menu1: menus[Math.floor(Math.random() * menus.length)],
          menu2: menus[Math.floor(Math.random() * menus.length)],
          menu3: menus[Math.floor(Math.random() * menus.length)],
          menu4: menus[Math.floor(Math.random() * menus.length)],
          menu5: menus[Math.floor(Math.random() * menus.length)],
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Cafes', cafeData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cafes', {})
  }
}
