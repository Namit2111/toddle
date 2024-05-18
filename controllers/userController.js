const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12707048',
    password: 'DQelkJxAau',
    database: 'sql12707048'
});

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

const registerUser = async (req, res) => {
    const { username, password } = req.body;  
    const hashedPassword = await bcrypt.hash(password, 8);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
        if (err) throw err;
        res.status(201).send({ message: "User registered!" });
    });
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).send({ message: 'Authentication failed' });
        }
        const token = jwt.sign({ id: results[0].id }, jwtSecret, { expiresIn: '1h' });
        res.send({ message: 'Logged in!', token });
    });
};

const searchUser = (req, res) => {
    const { username } = req.params;
    db.query('SELECT * FROM users WHERE username LIKE ?', [`%${username}%`], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
};

const followUser = (req, res) => {
    const { follower_id, following_id } = req.body;
    db.query('INSERT INTO follows (follower_id, following_id) VALUES (?, ?)', [follower_id, following_id], (err, results) => {
        if (err) throw err;
        res.send({ message: 'Following user!' });
    });
};

module.exports = {
    registerUser,
    loginUser,
    searchUser,
    followUser
};
