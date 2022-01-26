const { Router } = require('express');

const {
  postSaleProduct: postSaleProductController,
} = require('../controllers/saleProduct');

const router = Router();

router.post('/', postSaleProductController);

module.exports = router;
