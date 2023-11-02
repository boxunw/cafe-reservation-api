'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Reservation.belongsTo(models.Cafe, {
        foreignKey: 'cafeId'
      })
    }
  }
  Reservation.init({
    cafeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeslot: DataTypes.STRING,
    seat: DataTypes.INTEGER,
    tel: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'Reservations',
    underscored: true
  })
  return Reservation
}
