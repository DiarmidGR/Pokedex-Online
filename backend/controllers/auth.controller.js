const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

const setRefreshTokenCookie = (res, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    });
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });
};

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

        const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '300s'});// Expires in 5 minutes
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

        setRefreshTokenCookie(res, refreshToken);
        res.json({ accessToken, user_id: user.id });
    });
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const checkQuery = 'SELECT id FROM users WHERE username = ?';
    db.query(checkQuery, [username], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertQuery, [username, hashedPassword], (err, result) => {
                if (err) throw err;

                const userId = result.insertId;
                const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '300s' }); // Expires in 5 minutes
                const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

                setRefreshTokenCookie(res, refreshToken);
                res.status(201).json({ accessToken, user_id: userId });
            });
        } catch (hashErr) {
            res.status(500).json({ message: 'Error creating account.' });
        }
    });
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '300s' });
      const rotatedRefreshToken = jwt.sign({ id: decoded.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

      setRefreshTokenCookie(res, rotatedRefreshToken);
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      clearRefreshTokenCookie(res);
      res.status(401).json({ message: 'Invalid refresh token' });
    }
};

exports.logout = (req, res) => {
    clearRefreshTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
};
  