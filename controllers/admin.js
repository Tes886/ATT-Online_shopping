const Product = require('../models/product');
const fs = require('fs');
const path = require('path');



exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                pageTitle: 'Products',
                path: '/admin/products',
                prods: products
            });
        })
        .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
       // csrfToken : req.csrfToken()

    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const img = fs.readFileSync(req.file.path);
    const enc_image = img.toString('base64');
    const price = req.body.price;
    const description = req.body.description;


    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: enc_image,
        userId: req.user
    });
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.findById(prodId)
        .then(product => {
            res.render('admin/edit-product', {
                product: product,
                pageTitle: 'Edit Product',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));

}

exports.postEditProduct = async (req, res, next) => {
    const id = req.body._id;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    
    Product.findById(id).then(prod => {
     
        let enc_image= prod.imageUrl
      
        if(req.file){
        const img = fs.readFileSync(req.file.path);
        enc_image = img.toString('base64');
        }
        
        prod.title = title;
        prod.imageUrl = enc_image;
        prod.price = price;
        prod.description = description;
        return prod.save();
    })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    Product.findByIdAndRemove(req.body._id)
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

}