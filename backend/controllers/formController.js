const FeedbackForm = require("../models/FeedbackForm");

const createForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    if (!title?.trim() || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Title and at least one question are required" });
    }

    const form = await FeedbackForm.create({
      title: title.trim(),
      description: description?.trim(),
      questions,
      createdBy: req.user.id,
    });

    return res.status(201).json({ success: true, form });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to create feedback form" });
  }
};

const listForms = async (req, res) => {
  try {
    const forms = await FeedbackForm.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, forms });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to fetch feedback forms" });
  }
};

module.exports = { createForm, listForms };
