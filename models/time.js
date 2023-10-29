'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Time extends Model {
    static associate(models) {
      // define association here
      Time.belongsTo(models.Cafe, {
        foreignKey: 'cafeId'
      })
    }
  }
  Time.init({
    cafeId: DataTypes.INTEGER,
    timeslot: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Time',
    tableName: 'Times',
    underscored: true
  })
  return Time
}
