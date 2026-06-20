import { dailyHints } from "./puzzles.js";
import type { PuzzleData, CheckRowResponse, LetterResult } from "./types.js";

/**
 * Deterministically builds today's puzzle from the day of week.
 * Pure function of the supplied date, so the client and (legacy) server
 * always agree without any network round-trip.
 */
export function buildDailyPuzzle(date: Date = new Date()): PuzzleData {
  const day = date.getDay();
  const hintsForDay = dailyHints[day % dailyHints.length];

  return {
    id: day + 1,
    name: `Daily Puzzle #${day + 1}`,
    hints: hintsForDay.map((hint, index) => ({
      id: index + 1,
      rowIndex: index,
      text: hint.text,
      answer: hint.answer,
    })),
  };
}

/**
 * Scores a guess for a given row against the puzzle. Mirrors the original
 * `/api/check-row` server logic exactly: the final row is the solution and is
 * compared against itself; earlier rows are scored against the solution.
 */
export function scoreGuess(
  puzzle: PuzzleData,
  rowIndex: number,
  guess: string
): CheckRowResponse {
  const hint = puzzle.hints.find((h) => h.rowIndex === rowIndex);
  if (!hint) {
    throw new Error("Hint not found");
  }

  const solution = puzzle.hints[puzzle.hints.length - 1].answer.toUpperCase();
  const correctAnswer = hint.answer.toUpperCase();
  const userGuess = guess.toUpperCase();
  const isCorrect = userGuess === correctAnswer;

  const result: LetterResult[] = Array.from({ length: 5 }, (_, i) => {
    // Last row compares against itself (it IS the solution).
    if (rowIndex === puzzle.hints.length - 1) {
      return {
        letter: userGuess[i],
        status: userGuess[i] === correctAnswer[i] ? "correct" : "absent",
      };
    }
    if (userGuess[i] === solution[i]) {
      return { letter: userGuess[i], status: "correct" };
    }
    if (solution.includes(userGuess[i])) {
      return { letter: userGuess[i], status: "present" };
    }
    return { letter: userGuess[i], status: "absent" };
  });

  return { isCorrect, result };
}
