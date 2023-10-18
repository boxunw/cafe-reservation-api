'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Time extends Model {
    static associate(models) {
      // define association here
      Time.hasMany(models.Table, {
        foreignKey: 'timeId'
      })
    }
  }
  Time.init({
    timeslot: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Time',
    tableName: 'Times',
    underscored: true
  })
  return Time
}
