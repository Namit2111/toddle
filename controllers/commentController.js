// controllers/commentController.js
const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12707048',
    password: 'DQelkJxAau',
    database: 'sql12707048'
});

const createComment = (req, res) => {
    const { user_id, post_id, text } = req.body;
    if (!text) {
        return res.status(400).send({ message: 'Text is required' });
    }
    db.query(
        'INSERT INTO comments (user_id, post_id, text) VALUES (?, ?, ?)',
        [user_id, post_id, text],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error while adding comment' });
            }
            res.status(201).send({ message: 'Comment added successfully', commentId: results.insertId });
        }
    );
};

const getCommentsByPost = (req, res) => {
    const { postId } = req.params;
    db.query(
        'SELECT c.id, c.text, u.username, c.created_at FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC',
        [postId],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error fetching comments' });
            }
            res.status(200).json(results);
        }
    );
};

const deleteComment = (req, res) => {
    const { commentId } = req.params;
    db.query(
        'DELETE FROM comments WHERE id = ?',
        [commentId],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error deleting comment' });
            }
            if (results.affectedRows > 0) {
                res.status(200).send({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).send({ message: 'Comment not found' });
            }
        }
    );
};

const editComment = (req, res) => {
    const { commentId } = req.params;  // Get comment ID from URL parameters
    const { text } = req.body;         // Get new text from request body

    if (!text) {
        return res.status(400).send({ message: 'Text is required for updating a comment.' });
    }

    db.query(
        'UPDATE comments SET text = ? WHERE id = ?',
        [text, commentId],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Error while updating comment' });
            }
            if (results.affectedRows === 0) {
                // No rows were updated, which means there's no comment with the given ID
                return res.status(404).send({ message: 'Comment not found' });
            }
            res.status(200).send({ message: 'Comment updated successfully' });
        }
    );
};


module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment,
    editComment
};
