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

const createSales = async (transaction, salesArray, saleId) => {
  const productsIds = [];

  await Promise.all(salesArray.map(({ product_id: productId, quantity }, index) => {
    productsIds[index] = productId;
    return [
      SaleProduct.create({ saleId, productId, quantity }, { transaction }),
      Product.update({ quantity: sequelize.literal(`quantity - ${quantity}`) },
      { where: { id: productId } },
      { transaction }),
    ];
  }));

  return productsIds;
};

module.exports = async (salesArray) => {
  const transaction = await sequelize.transaction();

  try {
    const { id: saleId } = await Sale.create({}, { transaction });

    const productsIds = await createSales(transaction, salesArray, saleId);

    const { message, code } = await validateProductsQuantities(productsIds, salesArray);

    if (message) {
      await transaction.rollback();
      return { message, code, httpStatusCode: 422 };
    }

    await transaction.commit();
  
    return { result: { id: saleId, itemsSold: salesArray }, httpStatusCode: 201 };
  } catch (error) {
    await transaction.rollback();
    return { httpStatusCode: 500, code: 'server_error', message: error.message };
  }
};
