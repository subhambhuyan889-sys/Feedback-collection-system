const Feedback = require("../models/Feedback");
const FeedbackForm = require("../models/FeedbackForm");

const getBasicStats = async () => {
  const [totalFeedback, totalForms, recentFeedback] = await Promise.all([
    Feedback.countDocuments(),
    FeedbackForm.countDocuments({ isActive: true }),
    Feedback.find().sort({ createdAt: -1 }).limit(5).select("form submittedBy createdAt"),
  ]);

  return { totalFeedback, totalForms, recentFeedback };
};

module.exports = { getBasicStats };
