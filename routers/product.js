const { Router } = require('express');

const { validateNameAndQuantity } = require('../middlewares/product');

const { postProduct: postProductController } = require('../controllers/product');

const router = Router();

router.use('/', validateNameAndQuantity, postProductController);

module.exports = router;
