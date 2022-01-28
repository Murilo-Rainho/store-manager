const salesProductsServices = require('../../services/saleProduct');

module.exports = async (req, res, next) => {
  try {
    const { body: productIdAndQuantityArray } = req;
  
    const { code, message, httpStatusCode, result } = await salesProductsServices.postSaleProduct(
      productIdAndQuantityArray,
    );
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(httpStatusCode).json(result);
  } catch (error) {
    next(error);
  }
};
