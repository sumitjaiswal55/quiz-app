import { useState, useEffect } from "react";
import QuizQuestion from "./QuizQuestion"


const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem("leaderboard")) || []);
  const [lastAttempt, setLastAttempt] = useState(() => localStorage.getItem("lastAttempt") || 0);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    localStorage.setItem("lastAttempt", lastAttempt);
  }, [lastAttempt]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      handleNextQuestion();
    }
  }, [timer]);

  const saveScore = (finalScore) => {
    setLastAttempt(finalScore);
    const newLeaderboard = [...leaderboard, finalScore].sort((a, b) => b - a).slice(0, 5);
    setLeaderboard(newLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
  };

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;
    if (selectedAnswer === QuizQuestion[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    if (currentQuestionIndex + 1 < QuizQuestion.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer("");
      setTimer(30);
    } else {
      setShowResult(true);
      saveScore(score + (selectedAnswer === QuizQuestion[currentQuestionIndex].correctAnswer ? 1 : 0));
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedAnswer("");
      setTimer(30);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResult(false);
    setTimer(30);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      {!showResult ? (
        <div className="text-center w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1} / {QuizQuestion.length}</h3>
          <h2 className="text-3xl font-bold mb-4">{QuizQuestion[currentQuestionIndex].question}</h2>
          <p className="text-xl font-semibold">⏳ Time left: {timer}s</p>

          {QuizQuestion[currentQuestionIndex].type === "mcq" ? (
            <div className="grid grid-cols-2 gap-3">
              {QuizQuestion[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={`px-4 py-2 rounded-lg text-lg ${selectedAnswer && option === QuizQuestion[currentQuestionIndex].correctAnswer ? "bg-green-500" : selectedAnswer === option ? "bg-red-500" : "bg-gray-300 hover:bg-gray-400 text-black"}`}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Type your answer..."
              className="w-full p-3 mt-4 rounded-lg text-black"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
          )}

          <div className="flex justify-between mt-4">
            <button onClick={handlePreviousQuestion} className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600" disabled={currentQuestionIndex === 0}>← Previous</button>
            <button onClick={handleNextQuestion} className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600" disabled={!selectedAnswer}>Next →</button>
          </div>
        </div>
      ) : (
        <div className="text-center w-full max-w-md">
          <h2 className="text-4xl font-bold">🎉 Quiz Completed!</h2>
          <p className="text-xl mt-4">Your Score: {score} / {QuizQuestion.length}</p>
          <h3 className="text-xl font-bold mt-6">🏆 Leaderboard:</h3>
          <ul className="text-lg mt-2">
            {leaderboard.map((score, index) => (
              <li key={index} className="mt-1">{index + 1}. {score}</li>
            ))}
          </ul>
          <button onClick={handleRetry} className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">🔄 Retry Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
