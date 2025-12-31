"use client";

import React, { useState, useRef } from "react";
import { useUserContext } from "@/context/user";
import { useThemeMode } from "@/context/ThemeContext";
import toast from "@/utils/toast";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getLocalizedQuestion } from "@/utils/exerciseHelpers";
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ExerciseResults from './ExerciseResults'

/**
 * Fill in the Blank Exercise Component
 * Displays all questions at once as a complete text with blanks
 *
 * @param {Object} exercise - Exercise data from database
 * @param {Function} onComplete - Callback when exercise is completed
 */
const FillInTheBlank = ({ exercise, onComplete }) => {
  const t = useTranslations("exercises");
  const { isDark } = useThemeMode();
  const { user } = useUserContext();
  const params = useParams();

  // State
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: { blankIndex: value } }
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({}); // { questionIndex: { blankIndex: { correct, userAnswer, correctAnswer } } }
  const [showHints, setShowHints] = useState({}); // { questionIndex-blankIndex: boolean }
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);

  const locale = params.locale || "fr";

  // Support both formats: questions (materials) and sentences (lessons)
  let rawQuestions = exercise?.data?.questions || [];

  // Convert sentences format to questions format if needed
  if (!rawQuestions.length && exercise?.data?.sentences) {
    rawQuestions = exercise.data.sentences.map((sent, idx) => ({
      id: sent.id || idx + 1,
      text: sent.question || sent.sentence,
      blanks: [{
        answer: sent.answer,
        acceptableAnswers: sent.acceptableAnswers || [sent.answer],
        hint: sent.hint
      }],
      explanation: sent.explanation || sent.hint
    }))
  }

  // Localize all questions
  const questions = rawQuestions.map((q) => getLocalizedQuestion(q, locale));

  // Refs pour les champs de texte
  const inputRefs = useRef({});

  // Traductions des titres d'exercices
  const titleTranslations = {
    "Compréhension de l'audio": {
      en: "Audio comprehension",
      ru: "Понимание аудио",
      fr: "Compréhension de l'audio",
    },
    "Compréhension du texte": {
      en: "Text comprehension",
      ru: "Понимание текста",
      fr: "Compréhension du texte",
    },
    "Compléter le texte": {
      en: "Fill in the blanks",
      ru: "Заполните пропуски",
      fr: "Compléter le texte",
    },
  };

  // Fonction pour obtenir le titre traduit
  const getTranslatedTitle = () => {
    const locale = params.locale || "fr";
    const originalTitle = exercise?.title || "";

    // Si une traduction existe pour ce titre
    if (titleTranslations[originalTitle]) {
      return titleTranslations[originalTitle][locale] || originalTitle;
    }

    // Sinon, retourner le titre original
    return originalTitle;
  };

  // Créer une liste ordonnée de tous les blanks
  const getAllBlanks = () => {
    const blanks = [];
    questions.forEach((question, qIndex) => {
      const questionBlanks = question.blanks || [];
      questionBlanks.forEach((_, bIndex) => {
        blanks.push({ qIndex, bIndex });
      });
    });
    return blanks;
  };

  // Parse text to identify blanks
  const parseQuestionText = (text) => {
    if (!text) return [];

    // Split by ___ (blank markers)
    const parts = text.split(/(_+)/);

    // Further split text parts to separate leading punctuation
    const result = [];
    parts.forEach((part, index) => {
      if (part.match(/^_+$/)) {
        // This is a blank
        result.push({
          isBlank: true,
          text: part,
          blankIndex: Math.floor(index / 2),
        });
      } else if (part) {
        // Check if text starts with punctuation
        const match = part.match(/^([.,;:!?]+)(.*)/);
        if (match) {
          // Separate punctuation from the rest
          result.push({
            isBlank: false,
            text: match[1], // Punctuation
            blankIndex: null,
            isPunctuation: true,
          });
          if (match[2]) {
            result.push({
              isBlank: false,
              text: match[2], // Rest of text
              blankIndex: null,
            });
          }
        } else {
          result.push({
            isBlank: false,
            text: part,
            blankIndex: null,
          });
        }
      }
    });

    return result;
  };

  // Handle answer input
  const handleAnswerChange = (questionIndex, blankIndex, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        [blankIndex]: value.trim(),
      },
    }));
  };

  // Normalize Russian characters (е/ё are treated as equivalent)
  const normalizeRussianText = (text) => {
    return text.replace(/ё/g, "е").replace(/Ё/g, "Е");
  };

  // Check if answer is correct
  const checkAnswer = (questionIndex, blankIndex, userAnswer) => {
    const question = questions[questionIndex];
    const blank = question?.blanks?.[blankIndex];
    if (!blank || !userAnswer) return false;

    const correctAnswers = blank.correctAnswers || [];
    const normalizedUserAnswer = normalizeRussianText(userAnswer.toLowerCase());

    return correctAnswers.some((correct) => {
      const normalizedCorrect = normalizeRussianText(correct.toLowerCase());
      return normalizedCorrect === normalizedUserAnswer;
    });
  };

  // Submit all answers
  const handleSubmit = () => {
    const allResults = {};
    let totalCorrect = 0;
    let totalBlanks = 0;

    questions.forEach((question, qIndex) => {
      const questionResults = {};
      const blanks = question.blanks || [];

      blanks.forEach((blank, bIndex) => {
        totalBlanks++;
        const userAnswer = userAnswers[qIndex]?.[bIndex] || "";
        const isCorrect = checkAnswer(qIndex, bIndex, userAnswer);

        questionResults[bIndex] = {
          correct: isCorrect,
          userAnswer,
          correctAnswers: blank.correctAnswers || [],
        };

        if (isCorrect) totalCorrect++;
      });

      allResults[qIndex] = questionResults;
    });

    setResults(allResults);
    setSubmitted(true);

    // Calculate score
    const finalScore = Math.round((totalCorrect / totalBlanks) * 100);

    // Show feedback
    if (finalScore === 100) {
      toast.success(t("allCorrect"));
    } else if (finalScore >= 80) {
      toast.success(`${t("yourScore")}: ${finalScore}%`);
    } else if (finalScore >= 60) {
      toast.warning(`${t("yourScore")}: ${finalScore}%`);
    } else {
      toast.error(`${t("yourScore")}: ${finalScore}%`);
    }

    // Complete exercise
    completeExercise(finalScore, allResults);
  };

  // Complete exercise
  const completeExercise = async (finalScore, allResults) => {
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
    setUserAnswers({});
    setSubmitted(false);
    setResults({});
    setShowHints({});
    setExerciseCompleted(false);
    setTotalScore(0);
    setIsFirstCompletion(false);
  };

  // Toggle hint
  const toggleHint = (questionIndex, blankIndex) => {
    const key = `${questionIndex}-${blankIndex}`;
    setShowHints((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Check if all blanks are filled
  const allBlanksFilled = () => {
    return questions.every((question, qIndex) => {
      const blanks = question.blanks || [];
      return blanks.every((_, bIndex) => {
        const answer = userAnswers[qIndex]?.[bIndex];
        return answer && answer.trim().length > 0;
      });
    });
  };

  // Gérer la navigation avec Enter
  const handleKeyDown = (e, currentQIndex, currentBIndex) => {
    if (e.key === "Enter" && !submitted) {
      e.preventDefault();

      const allBlanks = getAllBlanks();
      const currentIndex = allBlanks.findIndex(
        (b) => b.qIndex === currentQIndex && b.bIndex === currentBIndex,
      );

      if (currentIndex !== -1 && currentIndex < allBlanks.length - 1) {
        // Passer au blanc suivant
        const nextBlank = allBlanks[currentIndex + 1];
        const nextKey = `${nextBlank.qIndex}-${nextBlank.bIndex}`;
        const nextInput = inputRefs.current[nextKey];
        if (nextInput) {
          nextInput.focus();
        }
      } else if (currentIndex === allBlanks.length - 1) {
        // C'est le dernier blanc, vérifier si tous sont remplis
        if (allBlanksFilled()) {
          handleSubmit();
        }
      }
    }
  };

  if (!exercise || questions.length === 0) {
    return (
      <div className={cn(
        "p-4 rounded-xl border-2",
        isDark
          ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
          : "bg-blue-50 border-blue-200 text-blue-700"
      )}>
        {t("noExerciseAvailable")}
      </div>
    );
  }

  // Exercise completion screen
  if (exerciseCompleted) {
    // Calculate correct/total blanks
    let totalCorrect = 0;
    let totalBlanks = 0;

    questions.forEach((question, qIndex) => {
      const blanks = question.blanks || [];
      blanks.forEach((blank, bIndex) => {
        totalBlanks++;
        const result = results[qIndex]?.[bIndex];
        if (result?.correct) totalCorrect++;
      });
    });

    // Build review items for incorrect answers
    const reviewItems = [];
    questions.forEach((question, qIndex) => {
      const blanks = question.blanks || [];
      blanks.forEach((blank, bIndex) => {
        const result = results[qIndex]?.[bIndex];
        if (result && !result.correct) {
          reviewItems.push({
            question: question.text,
            userAnswer: result.userAnswer || t("empty"),
            correctAnswer: result.correctAnswers.join(" / "),
            isCorrect: false,
            explanation: blank.hint || question.explanation
          });
        }
      });
    });

    return (
      <ExerciseResults
        score={totalScore}
        correctCount={totalCorrect}
        totalCount={totalBlanks}
        onRetry={handleReset}
        onNext={handleReset}
        reviewItems={reviewItems}
        playSound={true}
      />
    );
  }

  // Main exercise view - display all questions at once
  return (
    <div>
      {/* Exercise Instructions */}
      <Card className={cn(
        "p-4 md:p-6 mb-6 rounded-xl",
        isDark
          ? "bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-violet-500/20"
          : "bg-gradient-to-r from-violet-500/5 to-cyan-500/5 border-violet-500/15"
      )}>
        <h6 className="font-semibold mb-2 text-violet-500">
          {getTranslatedTitle()}
        </h6>
        <div className={cn(
          "p-3 rounded-lg",
          isDark
            ? "bg-cyan-500/15"
            : "bg-cyan-500/10"
        )}>
          <p className={cn(
            "font-semibold text-sm",
            isDark ? "text-cyan-300" : "text-cyan-700"
          )}>
            {t("listenToAudio")}
          </p>
        </div>
      </Card>

      {/* All Questions displayed as continuous text */}
      <Card className={cn(
        "p-6 md:p-8 mb-6 rounded-2xl",
        isDark
          ? "bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-violet-500/30"
          : "bg-gradient-to-br from-white/95 to-white/90 border-violet-500/20"
      )}>
        {questions.map((question, qIndex) => {
          const parsedText = parseQuestionText(question.text);
          const blanks = question.blanks || [];

          return (
            <div key={question.id || qIndex} className="mb-0">
              {/* Question text with inline blanks */}
              <div className="text-base md:text-lg leading-loose">
                {parsedText.map((part, partIndex) => {
                  if (part.isBlank) {
                    const blankIndex = part.blankIndex;
                    const blank = blanks[blankIndex];
                    const userAnswer = userAnswers[qIndex]?.[blankIndex] || "";
                    const result = results[qIndex]?.[blankIndex];
                    const isCorrect = result?.correct;
                    const showHint = showHints[`${qIndex}-${blankIndex}`];

                    return (
                      <span
                        key={partIndex}
                        className="inline-flex items-center gap-1"
                      >
                        <Input
                          value={userAnswer}
                          onChange={(e) =>
                            handleAnswerChange(
                              qIndex,
                              blankIndex,
                              e.target.value,
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, qIndex, blankIndex)
                          }
                          disabled={submitted}
                          placeholder="___"
                          ref={(el) => {
                            const key = `${qIndex}-${blankIndex}`;
                            inputRefs.current[key] = el;
                          }}
                          className={cn(
                            "w-[120px] sm:w-[150px] h-7 px-2 text-sm inline-block",
                            submitted
                              ? isCorrect
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-red-500 bg-red-500/10"
                              : isDark
                                ? "bg-violet-500/5"
                                : "bg-white"
                          )}
                        />
                        {submitted && (
                          isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )
                        )}
                        {!submitted && blank?.hint && (
                          <button
                            type="button"
                            onClick={() => toggleHint(qIndex, blankIndex)}
                            className="p-1 text-violet-500 hover:text-violet-600"
                          >
                            <Lightbulb className="w-4 h-4" />
                          </button>
                        )}
                      </span>
                    );
                  } else {
                    // Texte normal ou ponctuation
                    return (
                      <span
                        key={partIndex}
                        style={{
                          display: "inline",
                          whiteSpace: "pre-wrap",
                          marginLeft: part.isPunctuation ? "1px" : "0",
                          marginRight: part.isPunctuation ? "0" : "4px",
                        }}
                      >
                        {part.text}
                      </span>
                    );
                  }
                })}
              </div>

              {/* Show hints if requested */}
              {blanks.map((blank, bIndex) => {
                const showHint = showHints[`${qIndex}-${bIndex}`];
                if (!showHint || !blank.hint) return null;

                return (
                  <div
                    key={bIndex}
                    className={cn(
                      "mt-4 p-3 rounded-lg flex items-start gap-2",
                      isDark
                        ? "bg-blue-500/10 border border-blue-500/30"
                        : "bg-blue-50 border border-blue-200"
                    )}
                  >
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-blue-300" : "text-blue-700"
                    )}>
                      {blank.hint}
                    </p>
                  </div>
                );
              })}

              {/* Show correction after submission */}
              {submitted && results[qIndex] && (
                <div className="mt-4">
                  {blanks.map((blank, bIndex) => {
                    const result = results[qIndex]?.[bIndex];
                    if (!result || result.correct) return null;

                    return (
                      <div
                        key={bIndex}
                        className={cn(
                          "mt-2 p-3 rounded-lg",
                          isDark
                            ? "bg-red-500/10 border border-red-500/30"
                            : "bg-red-50 border border-red-200"
                        )}
                      >
                        <p className={cn(
                          "text-sm",
                          isDark ? "text-red-300" : "text-red-700"
                        )}>
                          <strong>{t("yourAnswer")}:</strong>{" "}
                          {result.userAnswer || "(vide)"} →
                          <strong> {t("correctAnswer")}:</strong>{" "}
                          {result.correctAnswer}
                        </p>
                        {blank.hint && (
                          <p className={cn(
                            "text-xs mt-1",
                            isDark ? "text-red-400" : "text-red-600"
                          )}>
                            {blank.hint}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {question.explanation && (
                    <div className={cn(
                      "mt-2 p-3 rounded-lg",
                      isDark
                        ? "bg-blue-500/10 border border-blue-500/30"
                        : "bg-blue-50 border border-blue-200"
                    )}>
                      <p className={cn(
                        "text-sm",
                        isDark ? "text-blue-300" : "text-blue-700"
                      )}>
                        <strong>{t("explanation")}:</strong>{" "}
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center gap-4">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!allBlanksFilled()}
            className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 disabled:opacity-50"
          >
            {t("checkAnswer")}
          </Button>
        ) : (
          <Button
            onClick={handleReset}
            className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("tryAgain")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(FillInTheBlank);
