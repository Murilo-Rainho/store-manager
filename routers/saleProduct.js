const { Router } = require('express');

const { validateProductIdAndQuantity } = require('../middlewares/saleProduct');

const {
  postSaleProduct: postSaleProductController,
} = require('../controllers/saleProduct');

const router = Router();

router.post('/', validateProductIdAndQuantity, postSaleProductController);

module.exports = router;
