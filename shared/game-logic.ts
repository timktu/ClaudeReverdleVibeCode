import { dailyPuzzles } from "./puzzles.js";
import type { PuzzleData, CheckRowResponse, LetterResult } from "./types.js";

/**
 * Deterministically builds today's puzzle from the day of week.
 * Pure function of the supplied date, so the client and (legacy) server
 * always agree without any network round-trip.
 */
export function buildDailyPuzzle(date: Date = new Date()): PuzzleData {
  const day = date.getDay();
  const puzzleForDay = dailyPuzzles[day % dailyPuzzles.length];

  return {
    id: day + 1,
    name: `Daily Puzzle #${day + 1}`,
    solution: puzzleForDay.solution.toUpperCase(),
    hints: puzzleForDay.hints.map((hint, index) => ({
      id: index + 1,
      rowIndex: index,
      text: hint.text,
      answer: hint.answer,
    })),
  };
}

/**
 * Scores a word against the puzzle's key word, Wordle-style. Every row is
 * compared against the same key word (`puzzle.solution`), which is a separate
 * word that may not appear among the grid rows.
 */
export function scoreWord(solution: string, word: string): LetterResult[] {
  const key = solution.toUpperCase();
  const value = word.toUpperCase();
  return Array.from({ length: 5 }, (_, i) => {
    if (value[i] === key[i]) {
      return { letter: value[i], status: "correct" };
    }
    if (key.includes(value[i])) {
      return { letter: value[i], status: "present" };
    }
    return { letter: value[i], status: "absent" };
  });
}

/**
 * Scores a guess for a given row. `isCorrect` reflects whether the guess
 * matches that row's own answer (derived from its hint), while the tile colors
 * always compare the word against the puzzle's key word.
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

  const userGuess = guess.toUpperCase();
  const isCorrect = userGuess === hint.answer.toUpperCase();

  return { isCorrect, result: scoreWord(puzzle.solution, userGuess) };
}
