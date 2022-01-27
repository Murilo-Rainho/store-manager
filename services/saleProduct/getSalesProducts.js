const { Sale, SaleProduct } = require('../../models');

module.exports = async () => {
  let CODE_MESSAGE = 'nothing_here';

  try {
    const allSalesProducts = await SaleProduct.findAll();

    const result = [];

    allSalesProducts.forEach(({ dataValues: obj }, index) => {
      const { productId, sale_id, ...rest } = obj;

      result[index] = { ...rest };
    });

    const salesPromises = await Promise.all(result.map(({ saleId }) => Sale.findByPk(saleId)));

    salesPromises.forEach(({ dataValues: { date } }, index) => {
      result[index].date = date;
    });

    return { result, httpStatusCode: 200 };
  } catch (error) {
    console.log(error);
    CODE_MESSAGE = 'server_error';
    return { httpStatusCode: 500, code: CODE_MESSAGE, message: 'Something is wrong in the server' };
  }
};
