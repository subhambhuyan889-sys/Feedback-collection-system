const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["text", "textarea", "rating", "single_choice", "multiple_choice"],
      required: true,
    },
    options: [{ type: String, trim: true }],
    required: { type: Boolean, default: true },
  },
  { _id: true }
);

const feedbackFormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 500 },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one question is required",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeedbackForm", feedbackFormSchema);
