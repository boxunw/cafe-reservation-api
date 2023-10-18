'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.Table, {
        foreignKey: 'tableId'
      })
    }
  }
  Reservation.init({
    tableId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    customer: DataTypes.STRING,
    gender: DataTypes.STRING,
    tel: DataTypes.STRING,
    email: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'Reservations',
    underscored: true
  })
  return Reservation
}
