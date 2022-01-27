const { Product } = require('../../models');

module.exports = async ({ name, quantity }) => {
  let CODE_MESSAGE = 'invalid_data';

  try {
    const alreadyExists = await Product.findOne({ where: { name } });
  
    if (alreadyExists) {
      return { httpStatusCode: 409, code: CODE_MESSAGE, message: 'Product already exists' };
    }
  
    const { dataValues: result } = await Product.create({ name, quantity });
  
    return { result, httpStatusCode: 201 };
  } catch (error) {
    CODE_MESSAGE = 'server_error';
    return { httpStatusCode: 500, code: CODE_MESSAGE, message: error.message };
  }
};
