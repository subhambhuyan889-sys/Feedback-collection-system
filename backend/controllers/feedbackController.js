const Feedback = require("../models/Feedback");
const FeedbackForm = require("../models/FeedbackForm");

const submitFeedback = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    if (!formId || answers === undefined) return res.status(400).json({ success: false, message: "Form and answers are required" });
    const form = await FeedbackForm.findOne({ _id: formId, isActive: true });
    if (!form) return res.status(404).json({ success: false, message: "Feedback form not found" });
    const feedback = await Feedback.create({ form: formId, submittedBy: req.user.id, answers });
    return res.status(201).json({ success: true, feedback });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to submit feedback" });
  }
};

const listResponses = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { submittedBy: req.user.id };
    const responses = await Feedback.find(filter).populate("form", "title").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, responses });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to fetch responses" });
  }
};

module.exports = { submitFeedback, listResponses };
