// This middleware is created for securing routes that require authentication. It will check if the user is logged in and if the token is valid. If the token is valid, the user will be able to access the protected route. If the token is invalid, the user will be redirected to the login page. If the user is not logged in, the user will be redirected to the login page.
// It is a helper for securing the API.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }
    // Make sure token exists. So, we don't know who is accessing the route.
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        // if we find the user, we can continue to the next middleware.
        next();
    } catch (err) {
        console.log(err.stack);
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
}
// Grant access to specific roles 
// roles is an array of roles that we want to grant access to.
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success: false, error: `User role ${req.user.role} is not authorized to access this route`});
        } 
        next();
    }
}