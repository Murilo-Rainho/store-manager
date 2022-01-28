const productServices = require('../../services/product');

module.exports = async (req, res, next) => {
  try {
    const { body: nameAndQuantity } = req;
  
    const {
      code,
      message,
      httpStatusCode,
      result,
    } = await productServices.postProduct(nameAndQuantity);
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(httpStatusCode).json({ ...result });
  } catch (error) {
    next(error);
  }
};
