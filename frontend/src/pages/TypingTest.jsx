import { useEffect, useState, useRef, useMemo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import paragraphs from "../data/paragraphs";

const TypingTest = () => {
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [result, setResult] = useState(null);

  // Refs to avoid ESLint dependency issues
  const correctCharsRef = useRef(0);
  const inputRef = useRef("");

  // Keep refs updated
  useEffect(() => {
    correctCharsRef.current = correctChars;
    inputRef.current = input;
  }, [correctChars, input]);

  // Select random paragraph
  const selectRandomParagraph = () => {
    const random =
      paragraphs[Math.floor(Math.random() * paragraphs.length)];
    setParagraph(random);
  };

  useEffect(() => {
    selectRandomParagraph();
  }, []);

  // Handle typing
  const handleChange = (e) => {
    const value = e.target.value;

    if (!isRunning) {
      setIsRunning(true);
    }

    if (value.length <= paragraph.length) {
      setInput(value);

      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === paragraph[i]) {
          correct++;
        }
      }
      setCorrectChars(correct);
    }
  };

  // Timer logic (CI-safe)
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          setIsRunning(false);
          setFinished(true);

          const timeElapsed = 60;
          const chars = correctCharsRef.current;
          const typedLength = inputRef.current.length;

          const wpm =
            timeElapsed > 0
              ? Math.round((chars / 5) / (timeElapsed / 60))
              : 0;

          const cpm =
            timeElapsed > 0
              ? Math.round(chars / (timeElapsed / 60))
              : 0;

          const accuracy =
            typedLength > 0
              ? Math.round((chars / typedLength) * 100)
              : 0;

          const resultData = { wpm, cpm, accuracy };
          setResult(resultData);

          API.post("/test/save", resultData).catch(() => {});

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const startTest = () => {
    setInput("");
    setCorrectChars(0);
    setFinished(false);
    setTimeLeft(60);
    selectRandomParagraph();
    setIsRunning(false);
    textareaRef.current.focus();
  };

  // Highlight rendering (optimized)
  const renderedParagraph = useMemo(() => {
    return paragraph.split("").map((char, index) => {
      let className = "";

      if (index < input.length) {
        className =
          char === input[index] ? "correct" : "incorrect";
      } else if (index === input.length) {
        className = "current";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  }, [paragraph, input]);

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Typing Test ⌨</h1>

        <div className="card">
          <h2>Time Left: {timeLeft}s</h2>

          <div className="paragraph-box">
            {renderedParagraph}
          </div>

          <textarea
            ref={textareaRef}
            rows="5"
            value={input}
            disabled={finished}
            onChange={handleChange}
            placeholder="Start typing here..."
            onPaste={(e) => e.preventDefault()}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              fontSize: "16px",
              borderRadius: "8px"
            }}
          />

          <br /><br />

          {!isRunning && !finished && (
            <button onClick={startTest}>Start Test</button>
          )}

          {finished && result && (
            <div className="result-overlay">
              <div className="result-modal">
                <h2> Test Completed!</h2>

                <div className="result-stats">
                  <div>
                    <h3>{result.wpm}</h3>
                    <p>WPM</p>
                  </div>

                  <div>
                    <h3>{result.cpm}</h3>
                    <p>CPM</p>
                  </div>

                  <div>
                    <h3>{result.accuracy}%</h3>
                    <p>Accuracy</p>
                  </div>
                </div>

                <div className="result-buttons">
                  <button onClick={startTest}>Restart</button>
                  <button
                    onClick={() =>
                      (window.location.href = "/dashboard")
                    }
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TypingTest;
