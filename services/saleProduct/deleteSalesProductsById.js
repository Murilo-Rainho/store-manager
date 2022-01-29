const { Product, Sale, SaleProduct, sequelize } = require('../../models');

const deleteSaleAndUpdateProducts = async (saleId) => {
  const transaction = await sequelize.transaction();

  try {
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
  
    return { products: updatedProducts };
  } catch (error) {
    await transaction.rollback();
    return { message: 'Something went wrong', code: 'server_error' };
  }
};

module.exports = async (saleId) => {
  try {
    const { dataValues: { date: saleDate } } = await Sale.findByPk(saleId);

    const { products, message, code } = await deleteSaleAndUpdateProducts(saleId);

    if (message) return { message, code, httpStatusCode: 500 }; 

    const lintSnakeCase = 'product_id';

    const result = [];

    products.forEach(({ dataValues: { id: productId, quantity } }, index) => {
      result[index] = {
        [lintSnakeCase]: productId,
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
