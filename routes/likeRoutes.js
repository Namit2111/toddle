// routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeControllers');

router.post('/like', likeController.likePost);
router.post('/unlike', likeController.unlikePost);

module.exports = router;
