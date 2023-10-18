'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cafe extends Model {
    static associate(models) {
      // define association here
      Cafe.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Cafe.belongsTo(models.City, {
        foreignKey: 'cityId'
      })
      Cafe.hasMany(models.Table, {
        foreignKey: 'cafeId'
      })
      Cafe.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'cafeId',
        as: 'FavoritedUsers'
      })
    }
  }
  Cafe.init({
    userId: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    cover: DataTypes.STRING,
    intro: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    tel: DataTypes.STRING,
    photo1: DataTypes.STRING,
    photo2: DataTypes.STRING,
    photo3: DataTypes.STRING,
    photo4: DataTypes.STRING,
    photo5: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cafe',
    tableName: 'Cafes',
    underscored: true
  })
  return Cafe
}
