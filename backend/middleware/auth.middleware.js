const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        
        // If everything is good, save the decoded information for use in other routes
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
