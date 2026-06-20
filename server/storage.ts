import { buildDailyPuzzle } from "../shared/game-logic.js";
import type { PuzzleData } from "../shared/types.js";

export const storage = {
  getActivePuzzle(): PuzzleData {
    return buildDailyPuzzle();
  },
};
