const Feedback = require("../models/Feedback");

const getRecentFeedback = (limit = 10) =>
  Feedback.find().sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 10, 50));

const getFeedbackCountByForm = () =>
  Feedback.aggregate([
    { $group: { _id: "$form", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

module.exports = { getRecentFeedback, getFeedbackCountByForm };
