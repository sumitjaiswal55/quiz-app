import { useState } from "react";
import Quiz from "./Quiz";

const Home = () => {
  const [startQuiz, setStartQuiz] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {!startQuiz ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Quiz!</h1>
          <p className="text-lg mb-6">Test your knowledge with our interactive quiz.</p>
          <button
            onClick={() => setStartQuiz(true)}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <Quiz />
      )}
    </div>
  );
};

export default Home;
