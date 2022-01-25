const { DataTypes } = require('sequelize');

const options = {
  timestamps: false,
  underscored: true,
  tableName: 'sales_products',
};

const columns = {
  saleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'sale_id',
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'product_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

module.exports = (sequelize, _DataTypes) => {
  const SaleProduct = sequelize.define('SaleProduct', columns, options);

  SaleProduct.associate = (models) => {
    models.Product.belongsToMany(models.Sale, {
      as: 'sales',
      through: SaleProduct,
      foreignKey: 'product_id',
      otherKey: 'sale_id',
    });
    models.Sale.belongsToMany(models.Product, {
      as: 'products',
      through: SaleProduct,
      foreignKey: 'sale_id',
      otherKey: 'product_id',
    });
  };

  return SaleProduct;
};
