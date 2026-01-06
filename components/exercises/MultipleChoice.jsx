"use client";

import { useState } from "react";
import { useUserContext } from "@/context/user";
import { useThemeMode } from "@/context/ThemeContext";
import toast from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getLocalizedQuestion } from "@/utils/exerciseHelpers";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ExerciseResults from './ExerciseResults'

/**
 * Multiple Choice Questions Exercise Component
 *
 * @param {Object} exercise - Exercise data from database
 * @param {Function} onComplete - Callback when exercise is completed
 */
const MultipleChoice = ({ exercise, onComplete }) => {
  const t = useTranslations("exercises");
  const { isDark } = useThemeMode();
  const { user } = useUserContext();
  const params = useParams();

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);

  const questions = exercise?.data?.questions || [];
  const locale = params.locale || "fr";
  const currentQuestion = getLocalizedQuestion(
    questions[currentQuestionIndex],
    locale,
  );
  const totalQuestions = questions.length;

  // Traductions des titres d'exercices
  const titleTranslations = {
    "Compréhension de l'audio": {
      en: "Audio comprehension",
      ru: "Понимание аудио",
      fr: "Compréhension de l'audio",
    },
    "Questions de compréhension": {
      en: "Comprehension questions",
      ru: "Вопросы на понимание",
      fr: "Questions de compréhension",
    },
    "Compréhension du texte": {
      en: "Text Comprehension",
      ru: "Понимание текста",
      fr: "Compréhension du texte",
    },
    "Text Comprehension": {
      en: "Text Comprehension",
      ru: "Понимание текста",
      fr: "Compréhension du texte",
    },
    "Понимание текста": {
      en: "Text Comprehension",
      ru: "Понимание текста",
      fr: "Compréhension du texte",
    },
    "Compréhension de lecture": {
      en: "Reading comprehension",
      ru: "Понимание прочитанного",
      fr: "Compréhension de lecture",
    },
  };

  // Handle answer selection
  const handleAnswerChange = (optionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionKey,
    }));
  };

  // Check if answer is correct
  const checkAnswer = (userAnswer) => {
    const correctAnswer = currentQuestion?.correctAnswer;
    return userAnswer === correctAnswer;
  };

  // Submit current question
  const handleSubmit = () => {
    if (!currentQuestion) return;

    const userAnswer = userAnswers[currentQuestionIndex];
    const isCorrect = checkAnswer(userAnswer);

    setResults((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        correct: isCorrect,
        userAnswer,
        correctAnswer: currentQuestion.correctAnswer,
      },
    }));
    setSubmitted(true);

    // Show feedback
    if (isCorrect) {
      toast.success("Bonne reponse !");
    } else {
      toast.error("Mauvaise reponse");
    }
  };

  // Next question
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSubmitted(false);
    } else {
      // Exercise completed
      completeExercise();
    }
  };

  // Complete exercise and calculate final score
  const completeExercise = async () => {
    let correctCount = 0;

    questions.forEach((question, qIndex) => {
      const result = results[qIndex];
      if (result?.correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / totalQuestions) * 100);
    setTotalScore(finalScore);
    setExerciseCompleted(true);

    // Call onComplete callback
    if (onComplete) {
      const result = {
        exerciseId: exercise.id,
        score: finalScore,
        completed: true,
      };

      // Call the callback (may submit to API) and get response
      const apiResponse = await onComplete(result);
      if (apiResponse?.isFirstCompletion) {
        setIsFirstCompletion(true);
      }
    }
  };

  // Reset exercise
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmitted(false);
    setResults({});
    setExerciseCompleted(false);
    setTotalScore(0);
    setIsFirstCompletion(false);
  };

  if (!exercise || questions.length === 0) {
    return (
      <div className={cn(
        "p-4 rounded-xl border-2",
        isDark
          ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
          : "bg-blue-50 border-blue-200 text-blue-700"
      )}>
        Aucun exercice disponible
      </div>
    );
  }

  // Exercise completion screen
  if (exerciseCompleted) {
    // Calculate correct count
    const correctCount = Object.values(results).filter(r => r.correct).length;

    // Build review items
    const reviewItems = questions.map((question, qIndex) => {
      const result = results[qIndex];
      const localizedQuestion = getLocalizedQuestion(question, locale);

      return {
        question: localizedQuestion.question,
        userAnswer: localizedQuestion.options.find(opt => opt.key === result?.userAnswer)?.text || t("empty"),
        correctAnswer: localizedQuestion.options.find(opt => opt.key === result?.correctAnswer)?.text,
        isCorrect: result?.correct || false,
        explanation: localizedQuestion.explanation
      };
    });

    return (
      <ExerciseResults
        score={totalScore}
        correctCount={correctCount}
        totalCount={questions.length}
        onRetry={handleReset}
        onNext={handleReset}
        reviewItems={reviewItems}
        playSound={true}
      />
    );
  }

  const userAnswer = userAnswers[currentQuestionIndex];
  const result = results[currentQuestionIndex];

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold">
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </span>
          <span className={cn(
            "text-sm",
            isDark ? "text-violet-400" : "text-violet-600"
          )}>
            {Math.round(
              ((currentQuestionIndex + (submitted ? 1 : 0)) / totalQuestions) *
                100,
            )}
            %
          </span>
        </div>
        <div className={cn(
          "h-2 rounded-full overflow-hidden",
          isDark ? "bg-violet-500/20" : "bg-violet-500/10"
        )}>
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + (submitted ? 1 : 0)) / totalQuestions) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className={cn(
        "p-6 md:p-8 mb-6 rounded-2xl",
        isDark
          ? "bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-violet-500/30"
          : "bg-gradient-to-br from-white/95 to-white/90 border-violet-500/20"
      )}>
        <h5 className={cn(
          "font-semibold mb-8 text-xl md:text-2xl leading-relaxed",
          isDark ? "text-slate-100" : "text-slate-800"
        )}>
          {currentQuestion?.question}
        </h5>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options?.map((option, index) => {
            const optionKey = option.key || String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = userAnswer === optionKey;
            const isCorrect = result?.correctAnswer === optionKey;
            const showCorrect = submitted && isCorrect;
            const showIncorrect = submitted && isSelected && !result?.correct;

            return (
              <button
                key={optionKey}
                onClick={() => !submitted && handleAnswerChange(optionKey)}
                disabled={submitted}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                  showCorrect
                    ? "border-emerald-500 bg-emerald-500/10"
                    : showIncorrect
                      ? "border-red-500 bg-red-500/10"
                      : isSelected
                        ? "border-violet-500 bg-violet-500/5"
                        : isDark
                          ? "border-violet-500/20 hover:border-violet-500 hover:bg-violet-500/5"
                          : "border-violet-500/10 hover:border-violet-500 hover:bg-violet-500/5",
                  submitted ? "cursor-default" : "cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Radio circle */}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    showCorrect
                      ? "border-emerald-500"
                      : showIncorrect
                        ? "border-red-500"
                        : isSelected
                          ? "border-violet-500"
                          : isDark
                            ? "border-violet-400"
                            : "border-violet-500"
                  )}>
                    {isSelected && (
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        showCorrect
                          ? "bg-emerald-500"
                          : showIncorrect
                            ? "bg-red-500"
                            : "bg-violet-500"
                      )} />
                    )}
                  </div>

                  {/* Option key chip */}
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-bold text-white",
                    showCorrect
                      ? "bg-emerald-500"
                      : showIncorrect
                        ? "bg-red-500"
                        : "bg-violet-500"
                  )}>
                    {optionKey}
                  </span>

                  {/* Option text */}
                  <span className={cn(
                    "flex-1 text-base md:text-lg",
                    isSelected ? "font-semibold" : "font-normal",
                    isDark ? "text-slate-100" : "text-slate-800"
                  )}>
                    {option.text}
                  </span>

                  {/* Result icons */}
                  {showCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 ml-auto" />
                  )}
                  {showIncorrect && (
                    <XCircle className="w-6 h-6 text-red-500 ml-auto" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation after submission */}
        {submitted && currentQuestion?.explanation && (
          <div className={cn(
            "mt-6 p-4 rounded-xl border",
            isDark
              ? "bg-blue-500/10 border-blue-500/30"
              : "bg-blue-50 border-blue-200"
          )}>
            <p className={cn(
              "font-semibold mb-1",
              isDark ? "text-blue-300" : "text-blue-700"
            )}>
              Explication :
            </p>
            <p className={cn(
              "text-sm",
              isDark ? "text-blue-200" : "text-blue-600"
            )}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 justify-end mt-6">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 disabled:opacity-50"
            >
              {t("checkAnswer")}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              {currentQuestionIndex < totalQuestions - 1
                ? t("next")
                : t("finish")}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MultipleChoice;
