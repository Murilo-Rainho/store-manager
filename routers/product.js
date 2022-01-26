const { Router } = require('express');

const { validateNameAndQuantity } = require('../middlewares/product');

const {
  postProduct: postProductController,
  getProducts: getProductsController,
  getProductById: getProductByIdController,
} = require('../controllers/product');

const router = Router();

router.post('/', validateNameAndQuantity, postProductController);

router.get('/', getProductsController);

router.get('/:id', getProductByIdController);

module.exports = router;
