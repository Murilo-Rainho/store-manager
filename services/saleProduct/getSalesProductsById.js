const { Sale, SaleProduct } = require('../../models');

module.exports = async (saleId) => {
  try {
    const { date } = await Sale.findByPk(saleId);

    const allSalesProducts = await SaleProduct.findAll({ where: { saleId } });

    const result = [];

    allSalesProducts.forEach(({ dataValues: obj }, index) => {
      const { productId, sale_id, saleId: _saleId, ...rest } = obj;

      result[index] = { ...rest, date };
    });

    return { result, httpStatusCode: 200 };
  } catch (error) {
    const CODE_MESSAGE = 'not_found';
    return { httpStatusCode: 404, code: CODE_MESSAGE, message: error.message };
  }
};
