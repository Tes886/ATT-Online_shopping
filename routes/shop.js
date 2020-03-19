const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isauth');

const router = express.Router();

router.get(['/', '/products'], shopController.getProducts);

router.get('/products/:prodId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/payement', isAuth, shopController.getcheckout);

router.post('/payement', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);
router.post('/cart-delete-single-item', isAuth, shopController.postCartSingleDeleteProduct);
module.exports = router;
