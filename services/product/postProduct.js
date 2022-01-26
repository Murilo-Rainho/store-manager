const { Product } = require('../../models');

module.exports = async ({ name, quantity }) => {
  const alreadyExists = await Product.findOne({ where: { name } });

  if (alreadyExists) {
    const CODE_MESSAGE = 'invalid_data';
    return { httpStatusCode: 409, code: CODE_MESSAGE, message: 'Product already exists' };
  }

  const { dataValues: result } = await Product.create({ name, quantity });

  return { result, httpStatusCode: 201 };
};
