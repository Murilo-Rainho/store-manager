const productServices = require('../../services/product');

module.exports = async (_req, res, next) => {
  try {
    const { code, message, httpStatusCode, result } = await productServices.getProducts();

    if (code) return res.status(httpStatusCode).json({ code, message });

    res.status(httpStatusCode).json(result);
  } catch (error) {
    next(error);
  }
};
