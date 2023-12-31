'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      // define association here
      City.hasMany(models.Cafe, {
        foreignKey: 'cityId'
      })
    }
  }
  City.init({
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'City',
    tableName: 'Cities',
    underscored: true
  })
  return City
}
