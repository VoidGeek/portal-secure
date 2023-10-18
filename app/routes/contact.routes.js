const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const contactController = require("../controllers/contact.controller");

// Define the route to handle contact form submissions
router.post("/api/contacts", contactController.createContact);
router.get(
    "/api/contacts",
    [authJwt.verifyToken, authJwt.isAdmin],
    contactController.getAllContacts
  );
module.exports = router;
