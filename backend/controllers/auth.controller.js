const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

exports.login = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: 'Please provide both username and password.'});
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(401).json({message: 'User not found.'});
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({message: 'Invalid credentials.'});
        }

        const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});// Expires in 5 minutes
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

        res.json({accessToken, refreshToken, user_id: user.id});
    });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });// Expires in 5 minutes
  
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  };
  