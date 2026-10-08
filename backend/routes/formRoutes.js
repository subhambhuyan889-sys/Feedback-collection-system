const express = require("express");
const { protect } = require("../middleware/auth");
const { createForm, listForms, listMyForms, getForm, updateForm, deleteForm } = require("../controllers/formController");

const router = express.Router();

router.get("/mine", protect, listMyForms);
router.get("/", protect, listForms);
router.post("/", protect, createForm);
router.get("/:id", protect, getForm);
router.put("/:id", protect, updateForm);
router.delete("/:id", protect, deleteForm);

module.exports = router;
