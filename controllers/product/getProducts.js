const { getProducts: getProductsService } = require('../../services/product');

module.exports = async (_req, res, next) => {
  try {
    const { code, message, httpStatusCode, result } = await getProductsService();

    if (code) return res.status(httpStatusCode).json({ code, message });

    res.status(httpStatusCode).json(result);
  } catch (error) {
    next(error);
  }
};
