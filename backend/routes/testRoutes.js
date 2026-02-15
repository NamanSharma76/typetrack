const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { saveTestResult, getUserResults } = require("../controllers/testController");

// Save test result (Protected)
router.post("/save", authMiddleware, saveTestResult);

// Get user's test history (Protected)
router.get("/history", authMiddleware, getUserResults);

module.exports = router;
