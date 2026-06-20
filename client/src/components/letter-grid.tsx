import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "@/stores/game-store";
import { useRowChecker } from "@/hooks/use-row-checker";
import { cn } from "@/lib/utils";
import type { PuzzleData } from "@shared/types";

interface LetterGridProps {
  puzzle: PuzzleData;
}

function getTileColor(puzzle: PuzzleData, rowIndex: number, colIndex: number): string {
  if (rowIndex === puzzle.hints.length - 1) {
    return "bg-[var(--tile-correct)] border-[var(--tile-correct)] text-white";
  }
  const solution = puzzle.hints[puzzle.hints.length - 1].answer.toUpperCase();
  const answer = puzzle.hints[rowIndex].answer.toUpperCase();
  const letter = answer[colIndex];

  if (letter === solution[colIndex]) return "bg-[var(--tile-correct)] border-[var(--tile-correct)] text-white";
  if (solution.includes(letter)) return "bg-[var(--tile-present)] border-[var(--tile-present)] text-white";
  return "bg-[var(--tile-absent)] border-[var(--tile-absent)] text-white";
}

export default function LetterGrid({ puzzle }: LetterGridProps) {
  const {
    grid, currentRow, currentCol, completedRows,
    selectCell, updateTile, findNextEmptyCell, isRowComplete,
  } = useGameStore();

  const { checkRow } = useRowChecker();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.match(/^[a-zA-Z]$/) && e.key.length === 1) {
        const letter = e.key.toUpperCase();
        if (currentRow !== null && currentCol !== null && !completedRows[currentRow]) {
          updateTile(currentRow, currentCol, letter);
          if (currentCol < 4) selectCell(currentRow, currentCol + 1);
          else if (currentRow < 4 && !completedRows[currentRow + 1]) selectCell(currentRow + 1, 0);
        } else {
          const next = findNextEmptyCell();
          if (next) {
            const [row, col] = next;
            updateTile(row, col, letter);
            if (col < 4) selectCell(row, col + 1);
          }
        }
      } else if (e.key === "Backspace") {
        if (currentRow !== null && currentCol !== null && !completedRows[currentRow]) {
          updateTile(currentRow, currentCol, "");
          if (currentCol > 0) selectCell(currentRow, currentCol - 1);
          else if (currentRow > 0 && !completedRows[currentRow - 1]) selectCell(currentRow - 1, 4);
        }
      } else if (e.key === "Enter") {
        if (currentRow !== null && !completedRows[currentRow]) {
          checkRow(currentRow);
        } else {
          for (let row = 0; row < 5; row++) {
            if (!completedRows[row] && isRowComplete(row)) { checkRow(row); break; }
          }
        }
      } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (currentRow === null || currentCol === null) {
          const next = findNextEmptyCell();
          if (next) selectCell(next[0], next[1]);
          return;
        }
        let [newRow, newCol] = [currentRow, currentCol];
        if (e.key === "ArrowUp" && currentRow > 0) newRow--;
        if (e.key === "ArrowDown" && currentRow < 4) newRow++;
        if (e.key === "ArrowLeft") { if (currentCol > 0) newCol--; else if (currentRow > 0) { newRow--; newCol = 4; } }
        if (e.key === "ArrowRight") { if (currentCol < 4) newCol++; else if (currentRow < 4) { newRow++; newCol = 0; } }
        if (!completedRows[newRow]) selectCell(newRow, newCol);
      }
    },
    [currentRow, currentCol, completedRows, updateTile, selectCell, findNextEmptyCell, isRowComplete, checkRow]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const isSelected =
            currentRow === rowIndex && currentCol === colIndex && !completedRows[rowIndex];
          const hasLetter = tile.letter !== "";
          const colorClass = getTileColor(puzzle, rowIndex, colIndex);

          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center text-xl font-bold rounded cursor-pointer select-none transition-colors duration-150",
                isSelected ? "border-2 border-primary ring-2 ring-primary/30" : "border-2 border-border",
                hasLetter ? colorClass : "bg-muted text-transparent"
              )}
              onClick={() => { if (!completedRows[rowIndex]) selectCell(rowIndex, colIndex); }}
              animate={hasLetter ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.08, ease: "easeOut" }}
            >
              <AnimatePresence mode="wait">
                {hasLetter && (
                  <motion.span
                    key={tile.letter}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.06 }}
                  >
                    {tile.letter}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
