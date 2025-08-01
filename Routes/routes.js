const express = require('express')
const productController = require('../Controller/productController')
const userController = require('../Controller/userController')
const categoryController = require('../Controller/categoryController');
const paymentController = require('../Controller/paymentController');
const ebillController = require('../Controller/ebillController');
const upload = require('../Middleware/upload');


const route = express.Router()

route.post('/api/user/signup', userController.signup);
route.post('/api/user/login', userController.login);

route.get('/api/product/getAllProducts', productController.getAllProducts);
route.get('/api/product/getSearchedProduct', productController.getSearchedProduct);
route.post('/api/product/addProduct', upload.single('strImage'), productController.addProduct)
route.put('/api/product/updateProduct/:pkProductId', upload.single('strImage'), productController.updateProductById);
route.post('/api/product/bulkUpload', upload.single('file'), productController.bulkUploadProducts);

route.post('/api/category/addCategory', upload.single('categoryImage'), categoryController.createCategory)
route.get('/api/category/getAllCategories', categoryController.getAllCategories)

route.post('/api/payment/create-order', paymentController.createOrder);

route.post('/api/ebill/send-ebill', ebillController.sendEbill);
// route.post('/api/ebill/send-email-ebill', ebillController.sendPdfEmail);

module.exports = route