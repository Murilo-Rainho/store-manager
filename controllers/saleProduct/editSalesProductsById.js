const {
  editSalesProductsById: editSalesProductsByIdService,
} = require('../../services/saleProduct');

module.exports = async (req, res, next) => {
  try {
    const { id: saleId } = req.params;
    
    const { code, message, httpStatusCode, result } = await editSalesProductsByIdService(
      { saleId, saleArray: req.body },
    );
  
    if (code) return res.status(httpStatusCode).json({ code, message });
    
    res.status(httpStatusCode).json({ ...result });
  } catch (error) {
    next(error);
  }
};
