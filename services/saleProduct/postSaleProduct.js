const {
  Sale,
  SaleProduct,
  sequelize,
} = require('../../models');

let CODE_MESSAGE = 'invalid_data';

module.exports = async (salesInfosArray) => {
  try {
    const transaction = await sequelize.transaction();

    const { id: saleId } = await Sale.create({}, { transaction });
  
    await Promise.all(salesInfosArray.map(({ product_id, quantity }) => (
      SaleProduct.create({ saleId, productId: product_id, quantity }, { transaction })
    )));

    await transaction.commit();
  
    return {
      result: { id: saleId, itemsSold: salesInfosArray },
      httpStatusCode: 201,
    };
  } catch (error) {
    console.log(error);
    CODE_MESSAGE = 'server_error';
    return { httpStatusCode: 500, code: CODE_MESSAGE, message: 'Something is wrong in the server' };
  }
};