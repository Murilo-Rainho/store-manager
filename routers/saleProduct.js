const { Router } = require('express');

const { validateProductIdAndQuantity } = require('../middlewares/saleProduct');

const {
  postSaleProduct: postSaleProductController,
  getSalesProducts: getSalesProductsController,
  getSalesProductsById: getSalesProductsByIdController,
} = require('../controllers/saleProduct');

const router = Router();

router.post('/', validateProductIdAndQuantity, postSaleProductController);

router.get('/', getSalesProductsController);

router.get('/:id', getSalesProductsByIdController);

module.exports = router;
