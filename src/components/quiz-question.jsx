import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function QuizQuestion({
  question,
  onAnswerSubmit,
  showFeedback,
  answer,
  timeLeft,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleOptionSelect = (option) => {
    if (!showFeedback && timeLeft > 0) {
      setSelectedAnswer(option);
      onAnswerSubmit(option);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#0F172A] mb-8">
        {question.question}
      </h2>
      <div className="space-y-4 mb-8">
        {question.type === "multiple-choice" ? (
          question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={showFeedback || timeLeft === 0}
              className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all
                ${
                  selectedAnswer === option
                    ? "border-[#0891B2] bg-[#F0F9FF]"
                    : "border-gray-200 hover:border-[#0891B2]/50"
                }
                ${
                  showFeedback && selectedAnswer === option
                    ? answer?.isCorrect
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                    : ""
                }
                ${
                  showFeedback || timeLeft === 0
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${
                    selectedAnswer === option
                      ? "border-[#0891B2]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === option && (
                    <div className="w-3 h-3 rounded-full bg-[#0891B2]" />
                  )}
                </div>
                <span className="text-[#0F172A]">{option}</span>
              </div>
              {showFeedback && selectedAnswer === option && (
                <div className="flex items-center mt-2">
                  {answer?.isCorrect ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Correct!
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-5 h-5 mr-2" />
                      Incorrect. The correct answer is {question.correctAnswer}
                    </div>
                  )}
                </div>
              )}
            </button>
          ))
        ) : (
          <div>
            <input
              type="number"
              value={selectedAnswer}
              placeholder="Type your value and click enter"
              onChange={(e) => setSelectedAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !showFeedback && timeLeft > 0) {
                  handleOptionSelect(e.target.value);
                }
              }}
              disabled={showFeedback || timeLeft === 0}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#0891B2] outline-none"
            />
            {showFeedback && (
              <div className="mt-4">
                {answer?.isCorrect ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Correct!
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-5 h-5 mr-2" />
                    Incorrect. The correct answer is {question.correctAnswer}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {timeLeft === 0 && !showFeedback && (
        <div className="text-red-600 mb-4">
          Time's up! Moving to next question...
        </div>
      )}
    </div>
  );
}
