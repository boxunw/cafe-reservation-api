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
    }
  }
  Table.init({
    cafeId: DataTypes.INTEGER,
    seat: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Table',
    tableName: 'Tables',
    underscored: true
  })
  return Table
}
