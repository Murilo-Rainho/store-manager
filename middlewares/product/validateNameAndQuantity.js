const Joi = require('joi');

const productObjSchema = Joi.object({
  name: Joi.string().min(5).required().messages({
    'string.base': '"name" must be a number',
    'string.min': '"name" length must be at least 5 characters long',
  }),
  quantity: Joi.number().min(1).required().messages({
    'number.base': '"quantity" must be a number larger than or equal to 1',
    'number.min': '"quantity" must be a number larger than or equal to 1',
  }),
});

const CODE_MESSAGE = 'invalid_data';

module.exports = async (req, res, next) => {
  const { error } = productObjSchema.validate(req.body);

  if (error) {
    let httpStatusCode;

    if (error.message.match(/" is required/i)) httpStatusCode = 400;
    else httpStatusCode = 422;

    const err = { code: CODE_MESSAGE, message: error.message };

    return res.status(httpStatusCode).json({ ...err });
  }

  next();
};
