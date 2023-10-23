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
      Reservation.belongsTo(models.Table, {
        foreignKey: 'tableId'
      })
    }
  }
  Reservation.init({
    userId: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER,
    date: DataTypes.STRING,
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
