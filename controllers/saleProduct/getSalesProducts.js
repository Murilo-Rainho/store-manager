const salesProductsServices = require('../../services/saleProduct');

module.exports = async (_req, res, next) => {
  try {
    const {
      code,
      message,
      httpStatusCode,
      result,
    } = await salesProductsServices.getSalesProducts();
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(httpStatusCode).json(result);
  } catch (error) {
    next(error);
  }
};
