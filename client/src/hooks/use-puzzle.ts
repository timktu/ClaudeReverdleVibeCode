import { useQuery, useMutation } from "@tanstack/react-query";
import type { PuzzleData, CheckRowResponse } from "@shared/types";
import { buildDailyPuzzle, scoreGuess } from "@shared/game-logic";

export function usePuzzle() {
  return useQuery<PuzzleData>({
    queryKey: ["puzzle"],
    // Computed entirely client-side — no backend required (GitHub Pages friendly).
    queryFn: async () => buildDailyPuzzle(),
    staleTime: Infinity,
  });
}

export function useCheckRow() {
  return useMutation<
    CheckRowResponse,
    Error,
    { rowIndex: number; guess: string }
  >({
    mutationFn: async ({ rowIndex, guess }) => {
      const puzzle = buildDailyPuzzle();
      return scoreGuess(puzzle, rowIndex, guess);
    },
  });
}
