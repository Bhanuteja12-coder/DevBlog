const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied"});
    }

    try {
        // try
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};