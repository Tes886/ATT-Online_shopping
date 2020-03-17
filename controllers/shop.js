const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: 'Product Detail',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

exports.getCart = async (req, res, next) => {

    user = await User.findById({ _id: req.session.user._id })
    user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(async product => {
            user = await User.findById({ _id: req.session.user._id })

            return user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    user = await User.findById({ _id: req.session.user._id })
    user
        .deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};



// payment page 
//create product order
exports.postOrder = async (req, res, next) => {
    user = await User.findById({ _id: req.session.user._id })
    user
        .populate('cart.items.productId')
        .execPopulate()
        .then(async user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            // const order = new Order({
            //     user: {
            //         name: req.session.user.name,
            //         userId: req.session.user._id
            //     },
            //     products: products
            // });
           await Order.create({ user: {
                name: req.session.user.name,
                userId: req.session.user._id
            }, products: products})
          //  return order.save();
        })
        .then(result => {
            return user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};
