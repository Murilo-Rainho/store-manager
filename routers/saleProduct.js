const { Router } = require('express');

const {
  validateProductIdAndQuantity,
} = require('../middlewares/saleProduct');

const {
  postSaleProduct: postSaleProductController,
  getSalesProducts: getSalesProductsController,
  getSalesProductsById: getSalesProductsByIdController,
  editSalesProductsById: editSalesProductsByIdController,
  deleteSalesProductsById: deleteSalesProductsByIdController,
} = require('../controllers/saleProduct');

const router = Router();

router.post('/', validateProductIdAndQuantity, postSaleProductController);

router.get('/', getSalesProductsController);

router.get('/:id', getSalesProductsByIdController);

router.put('/:id', validateProductIdAndQuantity, editSalesProductsByIdController);

router.delete('/:id', deleteSalesProductsByIdController);

module.exports = router;
