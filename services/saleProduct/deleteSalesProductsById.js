const { Product, Sale, SaleProduct, sequelize } = require('../../models');

const deleteSaleAndUpdateProducts = async (saleId) => {
  const transaction = await sequelize.transaction();

  const salesProducts = await SaleProduct.findAll({ where: { saleId } }, { transaction });

  const productsIds = salesProducts.map(({ product_id: productId }) => productId);
  
  await Promise
    .all(salesProducts.map(({ product_id: productId, quantity }) => (
      Product.update({ quantity: sequelize.literal(`quantity + ${quantity}`) },
        { where: { id: productId } },
        { transaction })
    )));
  
  const updatedProducts = await Product.findAll({ where: { id: productsIds } });
      
  await Sale.destroy({ where: { id: saleId } }, { transaction });
  
  await transaction.commit();

  return updatedProducts;
};

module.exports = async (saleId) => {
  try {
    const { dataValues: { date: saleDate } } = await Sale.findByPk(saleId);

    const products = await deleteSaleAndUpdateProducts(saleId);

    const result = [];

    products.forEach(({ dataValues: { id: productId, quantity } }, index) => {
      result[index] = {
        // product_id: id,
        productId, // retirar essa linha depois que o lint parar de reclamar de snake_case
        quantity,
        date: saleDate,
      };
    });

    return { result, httpStatusCode: 200 };
  } catch (error) {
    const CODE_MESSAGE = 'not_found';
    return { httpStatusCode: 404, code: CODE_MESSAGE, message: 'Sale not found' };
  }
};
