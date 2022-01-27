const { Product } = require('../../models');

module.exports = async ({ productId, name, quantity }) => {
  let CODE_MESSAGE = 'not_found';
  try {
    const [editedQuantities] = await Product.update(
      { name, quantity },
      { where: { id: productId } },
    );

    if (!editedQuantities) {
      return { httpStatusCode: 404, code: CODE_MESSAGE, message: 'Product not found' };
    }

    return { result: { name, quantity, id: productId }, httpStatusCode: 200 };
  } catch (error) {
    CODE_MESSAGE = 'server_error';
    return { httpStatusCode: 500, code: CODE_MESSAGE, message: error.message };
  }
};
