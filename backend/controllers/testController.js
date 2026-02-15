const TestResult = require("../models/TestResult");

// Save Typing Test Result
exports.saveTestResult = async (req, res) => {
  try {
    const { wpm, cpm, accuracy, difficulty } = req.body;

    const newResult = await TestResult.create({
      user: req.user.id,   // coming from JWT middleware
      wpm,
      cpm,
      accuracy,
      difficulty
    });

    res.status(201).json({
      message: "Test result saved successfully",
      data: newResult
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save test result",
      error: error.message
    });
  }
};


// Get Logged-in User Test History
exports.getUserResults = async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch results",
      error: error.message
    });
  }
};
