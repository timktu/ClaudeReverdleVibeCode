import { motion } from "motion/react";
import { Delete, CornerDownLeft } from "lucide-react";
import { useGameStore } from "@/stores/game-store";
import { useRowChecker } from "@/hooks/use-row-checker";
import { cn } from "@/lib/utils";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export default function Keyboard() {
  const {
    grid, currentRow, currentCol, completedRows,
    updateTile, selectCell, findNextEmptyCell, isRowComplete,
  } = useGameStore();

  const { checkRow } = useRowChecker();

  const getKeyStatus = (key: string) => {
    let best = "";
    for (const row of grid) {
      for (const tile of row) {
        if (tile.letter !== key) continue;
        if (tile.status === "correct") return "correct";
        if (tile.status === "present" && best !== "correct") best = "present";
        if (tile.status === "absent" && !best) best = "absent";
      }
    }
    return best;
  };

  const handleKey = (key: string) => {
    if (key === "BACKSPACE") {
      if (currentRow !== null && currentCol !== null && !completedRows[currentRow]) {
        updateTile(currentRow, currentCol, "");
        if (currentCol > 0) selectCell(currentRow, currentCol - 1);
      }
    } else if (key === "ENTER") {
      if (currentRow !== null && !completedRows[currentRow]) {
        checkRow(currentRow);
      } else {
        for (let row = 0; row < 5; row++) {
          if (!completedRows[row] && isRowComplete(row)) { checkRow(row); break; }
        }
      }
    } else {
      if (currentRow !== null && currentCol !== null && !completedRows[currentRow]) {
        updateTile(currentRow, currentCol, key);
        if (currentCol < 4) selectCell(currentRow, currentCol + 1);
      } else {
        const next = findNextEmptyCell();
        if (next) {
          const [r, c] = next;
          updateTile(r, c, key);
          if (c < 4) selectCell(r, c + 1);
        }
      }
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {ROWS.map((row, ri) => (
        <div key={ri} className={cn("flex justify-center gap-1", ri === 1 && "px-4")}>
          {row.map((key) => {
            const status = getKeyStatus(key);
            const isWide = key === "ENTER" || key === "BACKSPACE";
            return (
              <motion.button
                key={key}
                className={cn(
                  "h-14 rounded font-bold text-sm transition-colors",
                  isWide ? "px-3 min-w-[3.5rem]" : "flex-1 min-w-0",
                  status === "correct" ? "bg-[var(--tile-correct)] text-white" :
                  status === "present" ? "bg-[var(--tile-present)] text-white" :
                  status === "absent"  ? "bg-[var(--tile-absent)] text-white" :
                  isWide
                    ? "bg-muted-foreground/80 text-background hover:bg-muted-foreground"
                    : "bg-muted text-foreground hover:bg-muted/70"
                )}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.07 }}
                onClick={() => handleKey(key)}
                aria-label={key}
              >
                {key === "ENTER" ? (
                  <span className="flex items-center gap-1 justify-center text-xs">
                    <CornerDownLeft className="h-3.5 w-3.5" />
                    Enter
                  </span>
                ) : key === "BACKSPACE" ? (
                  <Delete className="h-4 w-4 mx-auto" />
                ) : (
                  key
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
