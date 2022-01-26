const Joi = require('joi');

const productObjSchema = Joi.object({
  product_id: Joi.number().min(1).required().messages({
    'string.base': '"product_id" must be a number larger than or equal to 1',
    'string.min': '"product_id" must be a number larger than or equal to 1',
    'any.required': '"product_id" is required',
  }),
  quantity: Joi.number().min(1).required().messages({
    'number.base': '"quantity" must be a number larger than or equal to 1',
    'number.min': '"quantity" must be a number larger than or equal to 1',
  }),
});

const CODE_MESSAGE = 'invalid_data';

module.exports = async (req, res, next) => {
  let error;

  req.body.forEach((obj) => {
    const { error: joiError } = productObjSchema.validate(obj);

    if (joiError) error = joiError;
  });

  if (error) {
    let httpStatusCode = 422;

    if (error.message.match(/" is required/i)) httpStatusCode = 400;

    const err = { code: CODE_MESSAGE, message: error.message };

    return res.status(httpStatusCode).json({ ...err });
  }

  next();
};
