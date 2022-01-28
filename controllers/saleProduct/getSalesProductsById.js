const salesProductsServices = require('../../services/saleProduct');

module.exports = async (req, res, next) => {
  try {
    const { id: saleId } = req.params;
    const {
      code,
      message,
      httpStatusCode,
      result,
    } = await salesProductsServices.getSalesProductsById(saleId);
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(httpStatusCode).json(result);
  } catch (error) {
    next(error);
  }
};
