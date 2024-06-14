const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Extract token from Authorization header (Bearer token)
    const token = authHeader.split(' ')[1];

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Attach decoded payload to request object
        req.user = decoded;
        next(); // Pass control to the next middleware or route handler
    });
};

module.exports = verifyToken;
