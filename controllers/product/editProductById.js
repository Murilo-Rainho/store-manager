const productServices = require('../../services/product');

module.exports = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { name, quantity } = req.body;

    const { code, message, httpStatusCode, result } = await productServices.editProductById(
      { productId, name, quantity },
    );
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(httpStatusCode).json(result);
  } catch (error) {
    next(error);
  }
};
