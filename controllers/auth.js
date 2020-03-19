const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    let temp = null;
    const flashMsg = req.flash('loginErr');
    if (flashMsg.length > 0) {
        temp = flashMsg[0];
    }
    res.render('auth/login', {
        pageTitle: 'Log in',
        path: '/login',
        errorMsg: temp
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            req.session.isAuthenticated = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                if (req.session.user.role == "admin") {
                                    res.redirect('/admin/products'); 
                                }
                                else {res.redirect('/');}
                            })
                        } else {
                            req.flash('loginErr', 'Invalid Username and Password!');
                            res.redirect('/login');
                        }
                    });
            } else {
                req.flash('loginErr', 'Invalid Username and Password!');
                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
   
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                       
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};
