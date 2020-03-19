const express = require('express');
const permit = require('../middleware/permissions');
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isauth');

const router = express.Router();

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get('/add-product', isAuth, permit("admin"), adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth, permit("admin"), upload.single('avatar'), adminController.postAddProduct);

router.get('/edit-product/:prodId', permit("admin"), isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, permit("admin"),upload.single('avatar'), adminController.postEditProduct);

router.post('/delete-product', isAuth, permit("admin"), adminController.postDeleteProduct);

module.exports = router;
