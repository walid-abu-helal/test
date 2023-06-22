const path = require('path');
const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth');

router.use(isAuth);
router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

//  /admin/products  get
router.get('/products', adminController.getProduct);

router.post('/edit-product',adminController.postEditProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/delete-product',adminController.postDeleteProduct);


module.exports = router;
