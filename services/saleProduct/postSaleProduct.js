const { Sale, Product, SaleProduct, sequelize } = require('../../models');

const orderProductsAndSales = (allProducts, allSales) => {
  const orderedProducts = allProducts
    .sort(({ dataValues: { id: idA } }, { dataValues: { id: idB } }) => {
      if (idA > idB) return 1;
      if (idB > idA) return -1;
      return 0;
    });

  const orderedSales = allSales.sort(({ product_id: a }, { product_id: b }) => {
    if (a > b) return 1;
    if (b > a) return -1;
    return 0;
  });

  return { orderedProducts, orderedSales };
};

const validateProductsQuantities = async (productId, salesInfosArray) => {
  const allProducts = await Product.findAll({ where: { id: productId } });

   const { orderedProducts, orderedSales } = orderProductsAndSales(allProducts, salesInfosArray);

  const result = {};

  orderedProducts.forEach(({ dataValues: { quantity } }, index) => {
    if (orderedSales[index].quantity > quantity) {
      result.code = 'many_sales';
      result.message = 'Such amount is not permitted to sell';
    }
  });

  return result;
};

module.exports = async (salesInfosArray) => {
  try {
    const transaction = await sequelize.transaction();

    const { id: saleId } = await Sale.create({}, { transaction });

    const productsIds = [];
  
    await Promise.all(salesInfosArray.map(({ product_id: productId, quantity }, index) => {
      productsIds[index] = productId;
      return SaleProduct.create({ saleId, productId, quantity }, { transaction });
    }));

    const { message, code } = await validateProductsQuantities(productsIds, salesInfosArray);

    if (message) {
      await transaction.rollback();
      return { message, code, httpStatusCode: 422 };
    }

    await transaction.commit();
  
    return { result: { id: saleId, itemsSold: salesInfosArray }, httpStatusCode: 201 };
  } catch (error) {
    return { httpStatusCode: 500, code: 'server_error', message: error.message };
  }
};
