const { Router } = require('express');

const { validateNameAndQuantity } = require('../middlewares/product');

const {
  postProduct: postProductController,
  getProducts: getProductsController,
  getProductById: getProductByIdController,
  editProductById: editProductByIdController,
} = require('../controllers/product');

const router = Router();

router.post('/', validateNameAndQuantity, postProductController);

router.get('/', getProductsController);

router.get('/:id', getProductByIdController);

router.put('/:id', validateNameAndQuantity, editProductByIdController);

module.exports = router;
