import { useEffect, useState, useRef, useCallback} from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import paragraphs from "../data/paragraphs";

const TypingTest = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [correctChars, setCorrectChars] = useState(0);

  const textareaRef = useRef(null);

  // Select random paragraph
  const selectRandomParagraph = () => {
    const random =
      paragraphs[Math.floor(Math.random() * paragraphs.length)];
    setParagraph(random);
  };

  useEffect(() => {
    selectRandomParagraph();
  }, []);

  
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Start timer on first keypress
    if (!isRunning) {
      setIsRunning(true);
    }
    
    if (value.length <= paragraph.length) {
      setInput(value);
      
      // Count correct characters
      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === paragraph[i]) {
          correct++;
        }
      }
      setCorrectChars(correct);
    }
  };
  
  const [result, setResult] = useState(null);
  
  const finishTest = useCallback (async() => {
    setIsRunning(false);
    setFinished(true);
    
    const timeElapsed = 60 - timeLeft;
    
    const wpm =
    timeElapsed > 0
    ? Math.round((correctChars / 5) / (timeElapsed / 60))
    : 0;
    
    const cpm =
    timeElapsed > 0
    ? Math.round(correctChars / (timeElapsed / 60))
    : 0;
    
    const accuracy =
    input.length > 0
    ? Math.round((correctChars / input.length) * 100)
    : 0;
    
    const resultData = { wpm, cpm, accuracy };
    setResult(resultData);
    
    try {
      await API.post("/test/save", resultData);
    } catch (err) {
      console.log(err.response?.data);
    }
  },[timeLeft, correctChars, input]);
  
  // Timer logic
  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }

    if (timeLeft === 0 && isRunning) {
      finishTest();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isRunning, finishTest]);

  const startTest = () => {
    setInput("");
    setCorrectChars(0);
    setFinished(false);
    setTimeLeft(60);
    selectRandomParagraph();
    setIsRunning(false);
    textareaRef.current.focus();
  };
     
  const renderParagraph = () => {
    return paragraph.split("").map((char, index) => {
      let className = "";

      if (index < input.length) {
        className = char === input[index] ? "correct" : "incorrect";
      } else if (index === input.length) {
        className = "current";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Typing Test ⌨</h1>

        <div className="card">
          <h2>Time Left: {timeLeft}s</h2>

          <div className="paragraph-box">
            {renderParagraph()}
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
                <h2>🎉 Test Completed!</h2>

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
                    <button onClick={() => window.location.href="/dashboard"}>
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
