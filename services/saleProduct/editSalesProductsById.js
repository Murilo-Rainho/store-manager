const { SaleProduct } = require('../../models');

module.exports = async ({ saleArray, saleId }) => {
  try {
    await Promise.all(saleArray.map(({ product_id: productId, quantity }) => (
      SaleProduct.update(
        { productId, quantity },
        { where: { saleId, productId } },
      )
    )));

    return { result: {
      saleId: Number(saleId), itemUpdated: saleArray,
    },
    httpStatusCode: 200 };
  } catch (error) {
    const CODE_MESSAGE = 'server_error';
    return { httpStatusCode: 500, code: CODE_MESSAGE, message: error.message };
  }
};
