const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    week: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    thisWeek: {
      type: String,
      required: true,
      trim: true,
    },
    idea: {
      type: String,
      required: true,
      trim: true,
    },
    signals: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "Signals must contain at least one item.",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSeeded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
