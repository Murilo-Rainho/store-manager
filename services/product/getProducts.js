const { Product } = require('../../models');

module.exports = async () => {
  let CODE_MESSAGE = 'nothing_here';

  try {
    const allProducts = await Product.findAll();
  
    if (!allProducts) {
      return { httpStatusCode: 409, code: CODE_MESSAGE, message: 'Has no product registered' };
    }

    return { result: allProducts, httpStatusCode: 200 };
  } catch (error) {
    CODE_MESSAGE = 'server_error';
    return { httpStatusCode: 500, code: CODE_MESSAGE, message: error.message };
  }
};
