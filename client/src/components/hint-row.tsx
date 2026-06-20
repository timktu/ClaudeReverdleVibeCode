import { useGameStore } from "@/stores/game-store";
import { cn } from "@/lib/utils";
import type { Hint } from "@shared/types";

interface HintRowProps {
  hint: Hint;
}

export default function HintRow({ hint }: HintRowProps) {
  const { currentRow, completedRows, rowFeedback, selectCell, grid } =
    useGameStore();

  const isActive = currentRow === hint.rowIndex;
  const isCompleted = completedRows[hint.rowIndex];
  const feedback = rowFeedback[hint.rowIndex];

  const handleClick = () => {
    // Focus the first empty cell in this row, or the last cell
    const rowCells = grid[hint.rowIndex];
    const firstEmpty = rowCells.findIndex((t) => t.letter === "");
    selectCell(hint.rowIndex, firstEmpty >= 0 ? firstEmpty : 4);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-150 select-none",
        isCompleted
          ? "bg-[#6aaa64]/15 dark:bg-[#538d4e]/20 border border-[#6aaa64]/40"
          : isActive
            ? "bg-primary/10 border border-primary/40"
            : "bg-muted border border-transparent hover:border-border",
        feedback === "correct" && "animate-flash-green",
        feedback === "incorrect" && "animate-flash-red"
      )}
      onClick={handleClick}
    >
      <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
        {hint.rowIndex + 1}.
      </span>
      <p className="text-sm leading-snug">{hint.text}</p>
    </div>
  );
}
