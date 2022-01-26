const { postProduct: postProductService } = require('../../services/product');

module.exports = async (req, res, next) => {
  try {
    const { body: nameAndQuantity } = req;
  
    const { code, message, httpStatusCode, result } = await postProductService(nameAndQuantity);
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(201).json({ ...result });
  } catch (error) {
    next();
  }
};
