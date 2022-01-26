const { Product } = require('../../models');

module.exports = async (productId) => {
  try {
    const { dataValues: product } = await Product.findByPk(productId);

    return { result: product, httpStatusCode: 200 };
  } catch (error) {
    const CODE_MESSAGE = 'not_found';
    return { httpStatusCode: 404, code: CODE_MESSAGE, message: 'Product not found' };
  }
};
