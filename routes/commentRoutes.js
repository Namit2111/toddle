const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Route to add a comment
router.post('/add', commentController.createComment);

// Route to get all comments for a post
router.get('/posts/:postId/comments', commentController.getCommentsByPost);

// Route to delete a comment
router.delete('/delete/:commentId', commentController.deleteComment);

//Route to edit a comment
router.put('/edit/:commentId', commentController.editComment);

module.exports = router;
