

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'add product',
        path: '/admin/add-product',
        editing: false,


    });


}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user,

    });
    product.save()
        .then(result => {
            console.log(product);
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });


}

exports.getEditProduct = (req, res, next) => {
    const edirMode = req.query.edit;
    if (!edirMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    Product.findById(prodId)
        //Product.findByPk(prodId)
        .then(product => {

            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: edirMode,
                product: product,

            });
        }
        );

}
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/')
            } else {
                product.title = title;
                product.imageUrl = imageUrl;
                product.description = description;
                product.price = price;
                return product.save().then(result => {

                    res.redirect('/admin/products');

                })
            }


        })

        .catch(err => {

        })


}
exports.getProduct = (req, res, next) => {
    Product.find({ userId: req.user._id })
        //.select()
        //.populate('userId')
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',



            });
        }).catch(err => {
            console.log(err);
        });

}



exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id : prodId, userId: req.user._id})
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });




}


