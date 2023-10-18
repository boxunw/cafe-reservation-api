'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate(models) {
      // define association here
      Table.belongsTo(models.Cafe, {
        foreignKey: 'cafeId'
      })
      Table.belongsTo(models.Time, {
        foreignKey: 'timeId'
      })
      Table.hasMany(models.Reservation, {
        foreignKey: 'tableId'
      })
    }
  }
  Table.init({
    cafeId: DataTypes.INTEGER,
    timeId: DataTypes.INTEGER,
    seat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Table',
    tableName: 'Tables',
    underscored: true
  })
  return Table
}
