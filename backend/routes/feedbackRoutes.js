const express = require("express");
const { protect } = require("../middleware/auth");
const { submitFeedback, listResponses } = require("../controllers/feedbackController");

const router = express.Router();
router.post("/", protect, submitFeedback);
router.get("/", protect, listResponses);
module.exports = router;
