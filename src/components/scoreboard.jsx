import { CheckCircle, XCircle } from "lucide-react";

export default function Scoreboard({
  score,
  totalQuestions,
  history,
  onRestart,
  answers,
  questions,
  attemptNumber,
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#0F172A] mb-4">
        Quiz Results
      </h2>
      <div className="bg-[#F0F9FF] rounded-xl p-6 mb-8">
        <div className="text-2xl font-semibold text-[#0891B2] mb-2">
          Your Score: {score}/{totalQuestions} ({percentage}%)
        </div>
        <p className="text-gray-600">Attempt #{attemptNumber}</p>
      </div>

      <div className="space-y-6 mb-8">
        <h3 className="text-xl font-semibold text-[#0F172A]">
          Question Review
        </h3>
        {questions.map((question, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex items-start gap-3">
              {answers[index]?.isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              )}
              <div>
                <p className="font-medium text-[#0F172A]">
                  {question.question}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Your answer:{" "}
                  {answers[index]?.answer || "No answer (Time expired)"}
                </p>
                {!answers[index]?.isCorrect && (
                  <p className="text-sm text-green-600 mt-1">
                    Correct answer: {question.correctAnswer}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#0F172A] mb-4">
          Previous Attempts
        </h3>
        <div className="space-y-3">
          {history.map((attempt, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Attempt #{attempt.attemptNumber}
                  </p>
                  <p className="text-sm text-gray-600">{attempt.date}</p>
                </div>
                <div className="text-[#0891B2] font-medium">
                  {attempt.score}/{attempt.totalQuestions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full md:w-auto px-6 py-3 bg-[#0891B2] text-white rounded-lg font-medium hover:bg-[#0891B2]/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
