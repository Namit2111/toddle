// controllers/likeController.js
const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12707048',
    password: 'DQelkJxAau',
    database: 'sql12707048'
});

exports.likePost = (req, res) => {
    const { userId, postId } = req.body;
    // Fetch author_id from posts first to check its existence and match the userId
    db.query('SELECT author_id FROM posts WHERE id = ?', [postId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).send({ message: 'Post not found' });
        }
        const post = result[0];
        // if (post.author_id !== userId) {
        //     return res.status(403).send({ message: 'User not authorized to like this post' });
        // }

        // Proceed to like the post
        db.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).send({ message: 'Already liked' });
                }
                return res.status(500).send({ message: 'Error liking post' });
            }
            res.status(201).send({ message: 'Post liked successfully' });
        });
        
        
    });
};

exports.unlikePost = (req, res) => {
    const { userId, postId } = req.body;
    // Fetch author_id from posts first to check existence and match the userId
    db.query('SELECT author_id FROM posts WHERE id = ?', [postId], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).send({ message: 'Post not found' });
        }
        const post = result[0];
        // if (post.author_id !== userId) {
        //     return res.status(403).send({ message: 'User not authorized to unlike this post' });
        // }

        // Proceed to unlike the post
        db.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId], (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error unliking post' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ message: 'Like not found' });
            }
            res.status(200).send({ message: 'Post unliked successfully' });
        });
    });
};
