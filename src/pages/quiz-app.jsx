import { useState, useEffect } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import QuizQuestion from "../components/quiz-question";
import Scoreboard from "../components/scoreboard";
import { openDB } from "idb";

const questions = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: "Mercury",
  },
  {
    id: 2,
    type: "multiple-choice",
    question:
      "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "Queue",
  },
  {
    id: 3,
    type: "multiple-choice",
    question:
      "Which of the following is primarily used for structuring web pages?",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: "HTML",
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "Which chemical symbol stands for Gold?",
    options: ["Au", "Gd", "Ag", "Pt"],
    correctAnswer: "Au",
  },
  {
    id: 5,
    type: "multiple-choice",
    question:
      "Which of these processes is not typically involved in refining petroleum?",
    options: [
      "Fractional distillation",
      "Cracking",
      "Polymerization",
      "Filtration",
    ],
    correctAnswer: "Filtration",
  },
  {
    id: 6,
    type: "integer",
    question: "What is the value of 12 + 28?",
    correctAnswer: 40,
  },
  {
    id: 7,
    type: "integer",
    question: "How many states are there in the United States?",
    correctAnswer: 50,
  },
  {
    id: 8,
    type: "integer",
    question: "In which year was the Declaration of Independence signed?",
    correctAnswer: 1776,
  },
  {
    id: 9,
    type: "integer",
    question: "What is the value of pi rounded to the nearest integer?",
    correctAnswer: 3,
  },
  {
    id: 10,
    type: "integer",
    question:
      "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
    correctAnswer: 120,
  },
];

const initDB = async () => {
  return openDB("QuizDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("quizHistory")) {
        db.createObjectStore("quizHistory", {
          keyPath: "attemptNumber",
          autoIncrement: true,
        });
      }
    },
  });
};

export default function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizHistory, setQuizHistory] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      const db = await initDB();
      const tx = db.transaction("quizHistory", "readonly");
      const store = tx.objectStore("quizHistory");
      const allHistory = await store.getAll();
      setQuizHistory(allHistory);
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeUp();
    }

    const timer = setInterval(() => {
      if (timeLeft > 0 && !showFeedback) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback]);

  const handleTimeUp = () => {
    if (!answers[currentQuestionIndex]) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = { answer: null, isCorrect: false };
      setAnswers(newAnswers);
      setShowFeedback(true);
      setTimeout(() => {
        goToNext();
      }, 2000);
    }
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { answer, isCorrect };
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowFeedback(true);
    setTimeout(() => {
      goToNext();
    }, 2000);
  };

  const goToNext = () => {
    setShowFeedback(false);
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setTimeLeft(30);
    } else {
      endQuiz();
    }
  };

  const endQuiz = async () => {
    setShowScore(true);
    const newAttempt = {
      attemptNumber,
      date: new Date().toLocaleString(),
      score,
      answers,
      totalQuestions: questions.length,
    };
    const db = await initDB();
    const tx = db.transaction("quizHistory", "readwrite");
    const store = tx.objectStore("quizHistory");
    await store.add(newAttempt);
    const allHistory = await store.getAll();
    setQuizHistory(allHistory);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(30);
    setAnswers(Array(questions.length).fill(null));
    setShowFeedback(false);
    setAttemptNumber((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#E5F6FF] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-2xl font-bold ">QUIZ APP</h1>

        <a
          href="/"
          className="inline-flex items-center text-[#0891B2] mb-8 hover:text-[#0891B2]/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Homepage
        </a>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {showScore ? (
              <Scoreboard
                score={score}
                totalQuestions={questions.length}
                history={quizHistory}
                onRestart={restartQuiz}
                answers={answers}
                questions={questions}
                attemptNumber={attemptNumber}
              />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[#0891B2]">
                    Step {currentQuestionIndex + 1}/{questions.length}
                  </div>
                  <div className="flex items-center gap-2 text-[#0891B2]">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>
                </div>
                <QuizQuestion
                  question={questions[currentQuestionIndex]}
                  onAnswerSubmit={handleAnswer}
                  showFeedback={showFeedback}
                  answer={answers[currentQuestionIndex]}
                  timeLeft={timeLeft}
                />
              </>
            )}
          </div>
          <div className="flex-1 hidden md:block">
            <img
              src="one.png"
              alt="Decorative illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
