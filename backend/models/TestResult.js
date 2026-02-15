const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    wpm: {
      type: Number,
      required: true
    },
    cpm: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      default: "medium"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestResult", testResultSchema);
