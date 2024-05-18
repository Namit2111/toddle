// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const contentController = require('../controllers/postController');

router.post('/create', contentController.createPost);
router.delete('/delete/:postId', contentController.deletePost);

module.exports = router;
