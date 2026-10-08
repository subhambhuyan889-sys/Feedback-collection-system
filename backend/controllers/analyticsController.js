const Feedback = require("../models/Feedback");
const FeedbackForm = require("../models/FeedbackForm");

const getAnalytics = async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const responseFilter = isAdmin ? {} : { submittedBy: req.user.id };

    const [totalForms, totalResponses, forms, responses] = await Promise.all([
      FeedbackForm.countDocuments({ isActive: true }),
      Feedback.countDocuments(responseFilter),
      FeedbackForm.find({ isActive: true }).select("title"),
      Feedback.find(responseFilter)
        .select("form answers createdAt submittedBy")
        .populate("form", "title")
        .sort({ createdAt: -1 })
        .limit(1000),
    ]);

    const ratings = responses.flatMap((r) =>
      Object.values(r.answers || {}).filter(
        (v) => typeof v === "number" && v >= 1 && v <= 5
      )
    );

    const averageRating = ratings.length
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
      : null;

    const satisfaction = ratings.length
      ? Math.round((ratings.filter((v) => v >= 4).length / ratings.length) * 100)
      : null;

    const byForm = forms.map((form) => ({
      formId: form._id,
      title: form.title,
      responses: responses.filter(
        (response) => String(response.form?._id || response.form) === String(form._id)
      ).length,
    }));

    return res.json({
      success: true,
      analytics: {
        totalForms,
        totalResponses,
        averageRating,
        satisfaction,
        byForm,
        recentResponses: responses.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load analytics",
    });
  }
};

module.exports = { getAnalytics };
