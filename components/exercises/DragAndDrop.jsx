"use client";

import { useState, useEffect, useMemo } from "react";
import { useThemeMode } from "@/context/ThemeContext";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getLocalizedQuestion } from "@/utils/exerciseHelpers";
import { CheckCircle2, XCircle, GripVertical, ArrowLeftRight, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Matching/Pairing Exercise Component
 * Allows users to match items from left column to right column
 *
 * @param {Object} exercise - The exercise data
 * @param {Function} onComplete - Callback when exercise is completed
 */
const DragAndDrop = ({ exercise, onComplete }) => {
  const t = useTranslations("exercises");
  const { isDark } = useThemeMode();
  const params = useParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [rightItems, setRightItems] = useState([]);
  const [matches, setMatches] = useState({}); // { leftId: rightId }
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [score, setScore] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);
  const [questionResults, setQuestionResults] = useState([]); // Store results for each question

  const locale = params.locale || "fr";

  // Memoize the current question to avoid re-renders and flickering
  const currentQuestion = useMemo(() => {
    const rawQuestion = exercise.data?.questions?.[currentQuestionIndex];
    return getLocalizedQuestion(rawQuestion, locale);
  }, [exercise.data?.questions, currentQuestionIndex, locale]);

  // Traductions des titres d'exercices
  const titleTranslations = {
    "Compréhension de l'audio": {
      en: "Audio comprehension",
      ru: "Понимание аудио",
      fr: "Compréhension de l'audio",
    },
    "Association de vocabulaire": {
      en: "Vocabulary Association",
      ru: "Ассоциация слов",
      fr: "Association de vocabulaire",
    },
    "Vocabulary Association": {
      en: "Vocabulary Association",
      ru: "Ассоциация слов",
      fr: "Association de vocabulaire",
    },
    "Ассоциация слов": {
      en: "Vocabulary Association",
      ru: "Ассоциация слов",
      fr: "Association de vocabulaire",
    },
    "Associer les éléments": {
      en: "Match the elements",
      ru: "Сопоставьте элементы",
      fr: "Associer les éléments",
    },
    "Vocabulaire français-russe": {
      en: "French-Russian vocabulary",
      ru: "Французско-русский словарь",
      fr: "Vocabulaire français-russe",
    },
  };

  // Initialize/shuffle right items when question changes
  useEffect(() => {
    if (currentQuestion?.pairs) {
      // Shuffle right items
      const shuffled = [...currentQuestion.pairs].sort(
        () => Math.random() - 0.5,
      );
      setRightItems(shuffled);
      setMatches({});
      setIsChecked(false);
      setIsCorrect(false);
    }
  }, [currentQuestion]);

  // Drag handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnLeft = (e, leftPair) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Create the match
    const newMatches = { ...matches };

    // Remove any existing match with this right item
    Object.keys(newMatches).forEach((key) => {
      if (newMatches[key] === draggedItem.id) {
        delete newMatches[key];
      }
    });

    // Add new match
    newMatches[leftPair.id] = draggedItem.id;
    setMatches(newMatches);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Remove a match
  const handleRemoveMatch = (leftId) => {
    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);
  };

  // Check if answer is correct
  const checkAnswer = () => {
    // Check if all pairs are matched
    if (Object.keys(matches).length !== currentQuestion.pairs.length) {
      setIsCorrect(false);
      setIsChecked(true);
      return;
    }

    // Check if all matches are correct
    const correct = currentQuestion.pairs.every(
      (pair) => matches[pair.id] === pair.id,
    );

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  // Move to next question or complete
  const handleNext = async () => {
    // Save current question results
    const currentResults = {
      questionIndex: currentQuestionIndex,
      correct: isCorrect,
      matches: { ...matches },
      correctPairs: currentQuestion.pairs,
    };
    setQuestionResults((prev) => [...prev, currentResults]);

    if (currentQuestionIndex < exercise.data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Exercise complete - calculate final score
      // Note: score has already been updated in checkAnswer for the last question
      const totalQuestions = exercise.data.questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      setTotalScore(percentage);
      setExerciseCompleted(true);

      // Call onComplete callback
      if (onComplete) {
        const apiResponse = await onComplete({
          exerciseId: exercise.id,
          score: percentage,
          completed: true,
        });
        if (apiResponse?.isFirstCompletion) {
          setIsFirstCompletion(true);
        }
      }
    }
  };

  // Reset exercise
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setMatches({});
    setIsChecked(false);
    setIsCorrect(false);
    setExerciseCompleted(false);
    setTotalScore(0);
    setIsFirstCompletion(false);
    setQuestionResults([]);
  };

  // Try again
  const handleTryAgain = () => {
    const shuffled = [...currentQuestion.pairs].sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
    setMatches({});
    setIsChecked(false);
    setIsCorrect(false);
  };

  if (!currentQuestion) {
    return (
      <div className={cn(
        "p-4 rounded-xl border-2",
        isDark
          ? "bg-red-500/10 border-red-500/30 text-red-300"
          : "bg-red-50 border-red-200 text-red-700"
      )}>
        {t("exerciseNotFound")}
      </div>
    );
  }

  // Exercise completion screen
  if (exerciseCompleted) {
    return (
      <Card className={cn(
        "p-6 md:p-8 rounded-2xl text-center",
        isDark
          ? "bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-violet-500/30"
          : "bg-gradient-to-br from-white/95 to-white/90 border-violet-500/20"
      )}>
        <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
        <h4 className={cn(
          "text-2xl font-bold mb-2",
          isDark ? "text-slate-100" : "text-slate-800"
        )}>
          {t("exerciseCompleted")}
        </h4>
        <p className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
          {t("yourScore")} : {totalScore}%
        </p>
        <p className={cn(
          "mb-6",
          isDark ? "text-slate-400" : "text-slate-600"
        )}>
          {totalScore === 100 && t("perfectScore")}
          {totalScore >= 80 && totalScore < 100 && t("greatJob")}
          {totalScore >= 60 && totalScore < 80 && t("goodWork")}
          {totalScore < 60 && t("keepPracticing")}
        </p>
        {totalScore === 100 && isFirstCompletion && (
          <span className="inline-block px-4 py-2 mb-6 text-base font-bold text-white bg-violet-600 rounded-full">
            +{exercise.xp_reward} XP
          </span>
        )}
        {totalScore < 100 && (
          <>
            <div className={cn(
              "p-4 rounded-xl border-2 mb-6 text-left",
              isDark
                ? "bg-blue-500/10 border-blue-500/30"
                : "bg-blue-50 border-blue-200"
            )}>
              <p className={cn(
                "font-semibold",
                isDark ? "text-blue-300" : "text-blue-700"
              )}>
                {t("perfectScoreForXP")}
              </p>
            </div>

            {/* Correction Section */}
            <div className="mb-6 text-left">
              <h6 className="font-bold mb-4 text-red-500">
                {t("corrections")}
              </h6>
              {questionResults
                .filter((result) => !result.correct)
                .map((result, idx) => (
                  <Card
                    key={idx}
                    className={cn(
                      "p-4 mb-4 rounded-xl border-2 border-red-500",
                      isDark ? "bg-red-500/10" : "bg-red-50"
                    )}
                  >
                    <p className="font-semibold mb-4">
                      {t("question")} {result.questionIndex + 1}
                    </p>
                    {result.correctPairs
                      .filter((pair) => result.matches[pair.id] !== pair.id)
                      .map((pair) => {
                        const userMatchedId = result.matches[pair.id];
                        const userMatchedPair = result.correctPairs.find(
                          (p) => p.id === userMatchedId,
                        );

                        return (
                          <div key={pair.id} className="mb-3">
                            <p className="font-semibold mb-1">
                              {pair.left}
                            </p>
                            <div className="flex items-center gap-2 mb-1 ml-4">
                              <XCircle className="w-5 h-5 text-red-500" />
                              <span className="text-red-500 text-sm">
                                {t("yourAnswer")}:{" "}
                                {userMatchedPair?.right || t("empty")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              <span className="text-emerald-500 text-sm">
                                {t("correctAnswer")}: {pair.right}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </Card>
                ))}
            </div>
          </>
        )}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleReset}
            className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("tryAgain")}
          </Button>
        </div>
      </Card>
    );
  }

  // Get the right item that's matched to a left item
  const getMatchedRightItem = (leftId) => {
    const rightId = matches[leftId];
    if (!rightId) return null;
    return currentQuestion.pairs.find((p) => p.id === rightId);
  };

  // Check if a right item is already used
  const isRightItemUsed = (rightId) => {
    return Object.values(matches).includes(rightId);
  };

  return (
    <Card className={cn(
      "p-6 md:p-8 rounded-2xl",
      isDark
        ? "bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-violet-500/30"
        : "bg-gradient-to-br from-white/95 to-white/90 border-violet-500/20"
    )}>
      {/* Progress */}
      <div className="mb-6 flex justify-between items-center">
        <span className={cn(
          "text-sm",
          isDark ? "text-slate-400" : "text-slate-600"
        )}>
          {t("question")} {currentQuestionIndex + 1} /{" "}
          {exercise.data.questions.length}
        </span>
        <span className="text-sm font-semibold text-violet-500">
          {score} / {exercise.data.questions.length}
        </span>
      </div>

      {/* Instruction */}
      <h6 className={cn(
        "mb-6 font-semibold text-lg md:text-xl",
        isDark ? "text-slate-100" : "text-slate-800"
      )}>
        {currentQuestion.instruction}
      </h6>

      {/* Hint */}
      <div className={cn(
        "p-3 rounded-lg mb-6",
        isDark
          ? "bg-blue-500/10 border border-blue-500/30"
          : "bg-blue-50 border border-blue-200"
      )}>
        <p className={cn(
          "text-sm",
          isDark ? "text-blue-300" : "text-blue-700"
        )}>
          {t("dragInstruction")}
        </p>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Fixed items */}
        <div>
          <p className="text-sm font-semibold text-violet-500 mb-4">
            {t("leftColumn")}
          </p>
          {currentQuestion.pairs.map((pair) => {
            const matchedRight = getMatchedRightItem(pair.id);
            const isCorrectMatch = isChecked && matches[pair.id] === pair.id;

            return (
              <div
                key={pair.id}
                onDragOver={!isChecked ? handleDragOver : undefined}
                onDrop={
                  !isChecked ? (e) => handleDropOnLeft(e, pair) : undefined
                }
                className={cn(
                  "p-4 mb-3 min-h-[60px] rounded-xl flex items-center justify-between gap-3",
                  "transition-all duration-200",
                  isChecked
                    ? isCorrectMatch
                      ? "border-2 border-emerald-500 bg-emerald-500/10"
                      : "border-2 border-red-500 bg-red-500/10"
                    : matchedRight
                      ? "border-2 border-violet-500 bg-violet-500/10"
                      : cn(
                          "border-2 border-dashed",
                          isDark
                            ? "border-violet-500/30 bg-slate-800/50"
                            : "border-violet-500/30 bg-white"
                        )
                )}
              >
                <span className={cn(
                  "font-medium flex-1",
                  isDark ? "text-slate-200" : "text-slate-700"
                )}>
                  {pair.left}
                </span>

                {matchedRight ? (
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-violet-500" />
                    <div className={cn(
                      "px-3 py-2 rounded-lg",
                      isDark
                        ? "bg-violet-500/20 border border-violet-500/30"
                        : "bg-violet-500/10 border border-violet-500/30"
                    )}>
                      <span className="font-medium text-sm">
                        {matchedRight.right}
                      </span>
                    </div>
                    {!isChecked && (
                      <button
                        onClick={() => handleRemoveMatch(pair.id)}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        x
                      </button>
                    )}
                    {isChecked && (
                      isCorrectMatch ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )
                    )}
                  </div>
                ) : (
                  <span className={cn(
                    "text-xs",
                    isDark ? "text-slate-500" : "text-slate-400"
                  )}>
                    {t("dragInstruction").split(" ")[0]}...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column - Draggable items */}
        <div>
          <p className="text-sm font-semibold text-cyan-500 mb-4">
            {t("rightColumn")}
          </p>
          {rightItems.map((pair) => {
            const isUsed = isRightItemUsed(pair.id);
            const isDragging = draggedItem?.id === pair.id;

            return (
              <div
                key={pair.id}
                draggable={!isChecked && !isUsed}
                onDragStart={(e) => !isUsed && handleDragStart(e, pair)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "p-4 mb-3 min-h-[60px] rounded-xl flex items-center gap-3",
                  "transition-all duration-200",
                  "border",
                  isDark
                    ? "border-cyan-500/20 bg-slate-800/50"
                    : "border-cyan-500/20 bg-white",
                  isChecked || isUsed ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                  isUsed ? "opacity-40" : isDragging ? "opacity-50" : "opacity-100",
                  !isChecked && !isUsed && "hover:-translate-y-0.5 hover:shadow-md"
                )}
              >
                {!isUsed && !isChecked && (
                  <GripVertical className="w-5 h-5 text-cyan-500" />
                )}
                <span className={cn(
                  "flex-1 font-medium",
                  isUsed ? "line-through" : "",
                  isDark ? "text-slate-200" : "text-slate-700"
                )}>
                  {pair.right}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {isChecked && (
        <div className={cn(
          "p-4 rounded-xl mb-6",
          isCorrect
            ? isDark
              ? "bg-emerald-500/10 border border-emerald-500/30"
              : "bg-emerald-50 border border-emerald-200"
            : isDark
              ? "bg-red-500/10 border border-red-500/30"
              : "bg-red-50 border border-red-200"
        )}>
          <p className={cn(
            "font-semibold mb-1",
            isCorrect
              ? isDark ? "text-emerald-300" : "text-emerald-700"
              : isDark ? "text-red-300" : "text-red-700"
          )}>
            {isCorrect ? t("correct") : t("incorrect")}
          </p>
          {currentQuestion.explanation && (
            <p className={cn(
              "text-sm",
              isCorrect
                ? isDark ? "text-emerald-200" : "text-emerald-600"
                : isDark ? "text-red-200" : "text-red-600"
            )}>
              {currentQuestion.explanation}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        {!isChecked ? (
          <Button
            onClick={checkAnswer}
            disabled={
              Object.keys(matches).length !== currentQuestion.pairs.length
            }
            className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 disabled:opacity-50"
          >
            {t("checkAnswer")}
          </Button>
        ) : (
          <>
            {!isCorrect && (
              <Button
                variant="outline"
                onClick={handleTryAgain}
                className={cn(
                  "px-6 py-3 text-base font-semibold",
                  isDark
                    ? "border-violet-500 text-violet-400 hover:bg-violet-500/10"
                    : "border-violet-500 text-violet-600 hover:bg-violet-500/10"
                )}
              >
                {t("tryAgain")}
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {currentQuestionIndex < exercise.data.questions.length - 1
                ? t("next")
                : t("finish")}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default DragAndDrop;
