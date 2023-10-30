'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const cafes = await queryInterface.sequelize.query(
      'SELECT id FROM Cafes;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE role = \'user\';',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const favoriteData = []
    users.forEach(user => {
      const cafeData = cafes.slice() // copy cafes to cafeData
      for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * cafeData.length)
        const cafe = cafeData.splice(index, 1)[0]
        favoriteData.push({
          user_id: user.id,
          cafe_id: cafe.id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('Favorites', favoriteData)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Favorites', {})
  }
}
