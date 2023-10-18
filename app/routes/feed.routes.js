const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const feedController = require("../controllers/feed.controller");
const checkAdminPermission = require("../middlewares/projectPermission");

// Create a new project (POST)
router.post("/api/feeds", [authJwt.verifyToken, authJwt.isAdmin], feedController.createFeedItem);

// Get all projects (GET)
router.get("/api/feeds", feedController.getAllFeedItems);

// Get a specific project by ID (GET)
router.get("/api/feeds/:id", feedController.getFeedItemById);

// Update a project by ID (PUT)
router.put("/api/feeds/:id", [authJwt.verifyToken, authJwt.isAdmin,checkAdminPermission], feedController.updateFeedItem);

// Delete a project by ID (DELETE)
router.delete("/api/feeds/:id", [authJwt.verifyToken, authJwt.isAdmin,checkAdminPermission], feedController.deleteFeedItem);

module.exports = router;
