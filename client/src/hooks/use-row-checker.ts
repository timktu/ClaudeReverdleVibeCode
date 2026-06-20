import { useCallback } from "react";
import { toast } from "sonner";
import { useCheckRow } from "@/hooks/use-puzzle";
import { useGameStore } from "@/stores/game-store";

/**
 * Shared logic for validating a row against the server and updating game state.
 * Returns a stable `checkRow(rowIndex)` callback safe to use in keyboard handlers.
 */
export function useRowChecker() {
  const { grid, completedRows, isRowComplete, markRowCompleted, markRowShake, selectCell } =
    useGameStore();
  const mutation = useCheckRow();

  const checkRow = useCallback(
    async (rowIndex: number) => {
      if (completedRows[rowIndex] || !isRowComplete(rowIndex)) return;

      const guess = grid[rowIndex].map((t) => t.letter).join("");
      try {
        const data = await mutation.mutateAsync({ rowIndex, guess });
        if (data.isCorrect) {
          setTimeout(() => {
            markRowCompleted(rowIndex);
            if (rowIndex < 4) selectCell(rowIndex + 1, 0);
          }, 300);
        } else {
          markRowShake(rowIndex);
          toast.error("Not quite right. Keep trying!");
        }
      } catch {
        toast.error("Failed to check answer. Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid, completedRows, isRowComplete, markRowCompleted, markRowShake, selectCell]
  );

  return { checkRow, isPending: mutation.isPending };
}
