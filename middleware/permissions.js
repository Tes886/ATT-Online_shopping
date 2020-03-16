// middleware for doing role-based permissions
function permit(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;

    // return a middleware
    return (req, res, next) => {
        if (req.session.user && isAllowed(req.session.user.role)) {
            next(); // role is allowed, so continue on the next middleware
        } else {
            return res.redirect('/403');
        }
    }
}

module.exports = permit;