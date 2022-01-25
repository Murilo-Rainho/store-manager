const { DataTypes } = require('sequelize');

const columns = {
  saleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'sale_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: { model: 'sales', key: 'id' },
  },
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    field: 'product_id',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: { model: 'products', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.createTable('sales_products', columns);
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('sales_products');
  },
};