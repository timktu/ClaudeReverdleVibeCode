import HintRow from "@/components/hint-row";
import LetterGrid from "@/components/letter-grid";
import type { PuzzleData } from "@shared/types";

interface PuzzleBoardProps {
  puzzle: PuzzleData;
}

export default function PuzzleBoard({ puzzle }: PuzzleBoardProps) {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Hints
        </h2>
        {puzzle.hints.map((hint) => (
          <HintRow key={hint.id} hint={hint} />
        ))}
      </div>

      <LetterGrid puzzle={puzzle} />
    </div>
  );
}
