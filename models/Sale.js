const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('Sale', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.NOW },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: 'sales',
  });

  return Sale;
};
