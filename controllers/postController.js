// controllers/contentController.js
const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12707048',
    password: 'DQelkJxAau',
    database: 'sql12707048'
});
const createPost = (req, res) => {
    const { authorId, content, media, scheduledTime } = req.body;

    if (!content && !media) {
        return res.status(400).send({ message: 'Content or media is required' });
    }

    // Function to insert post into the database
    const insertPost = () => {
        db.query('INSERT INTO posts (author_id, content, media) VALUES (?, ?, ?)', [authorId, content, media], (err, results) => {
            if (err) {
                res.status(500).send({ message: 'Error while creating the post' });
            } else {
                res.status(201).send({ message: 'Post created successfully', postId: results.insertId });
            }
        });
    };

    // Check if scheduledTime is provided and is in the future
    if (scheduledTime) {
        const time = new Date(scheduledTime);
        const now = new Date();

        if (time > now) {
            // Schedule the post creation
            schedule.scheduleJob(time, insertPost);
            return res.status(200).send({ message: `Post scheduled at ${time.toString()}` });
        } else {
            return res.status(400).send({ message: 'Scheduled time must be in the future' });
        }
    } else {
        // If no scheduled time, insert immediately
        insertPost();
    }
};
const deletePost = (req, res) => {
    const { postId } = req.params;
    db.query('DELETE FROM posts WHERE id = ?', [parseInt(postId)], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error while deleting the post' });
        } else if (results.affectedRows > 0) {
            res.status(200).send({ message: 'Post deleted successfully' });
        } else {
            res.status(404).send({ message: 'Post not found' });
        }
    });
};

const getPostDetails = (req, res) => {
    const { postId } = req.params;
    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err || results.length === 0) {
            res.status(404).send({ message: 'Post not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

const getFeed = (req, res) => {
    const { userId } = req.params; // Assuming you pass userId as parameter or you could extract from JWT
    const sqlQuery = `
        SELECT p.* FROM posts p
        JOIN follows f ON p.author_id = f.following_id
        WHERE f.follower_id = ?
        ORDER BY p.created_at DESC`;
    db.query(sqlQuery, [userId], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error fetching feed' });
        } else {
            res.status(200).json(results);
        }
    });
};


module.exports = {
    createPost,
    deletePost,
    getPostDetails,
    getFeed
};
