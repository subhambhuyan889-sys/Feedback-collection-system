const express = require("express");
const { createForm, listForms } = require("../controllers/formController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, listForms);
router.post("/", protect, createForm);

module.exports = router;
