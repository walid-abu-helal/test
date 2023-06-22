//const path = require('path'); path.join();
const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {

            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
               
                
            });
        }).catch((err) => {

        });


}
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productsId;
    Product.findById(prodId)
        .then((product) => {
            console.log(product);
            res.render('shop/product-detail', {
                pageTitle: product.title,
                path: '/products',
                product: product,
               
            })
        }).catch((err) => {
            console.log(err);
        });

}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {

            res.render('shop/index', {
                prods: products,
                pageTitle: 'shop home',
                path: '/'
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log(user.cart.items);
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
               
            });
        }).catch(err => {

        })



}

exports.postCart = (req, res, next) => {



    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        }).then(result => {
            console.log(result);
            res.redirect('/cart');
        })


};
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFormCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {

        });





}
exports.postOrder = (req, res, next) => {


    req.user
        .populate('cart.items.productId')
        .then(user => {
            //console.log(user.cart.items);
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            });

            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
                products: products
            });
            return order.save();
        }).then(result => {
            req.user.clearCart()

        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            // console.log(orders[0].tiems[0]);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
               
            });

        })
        .catch(err => {

        })



}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Check out',
       
    });
}
