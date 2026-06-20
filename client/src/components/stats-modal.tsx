import { CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/game-store";

interface StatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StatsModal({ open, onOpenChange }: StatsModalProps) {
  const { completedRows, resetGame } = useGameStore();

  const completed = completedRows.filter(Boolean).length;
  const pct = Math.round((completed / 5) * 100);

  const handleNewPuzzle = () => {
    onOpenChange(false);
    resetGame();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Statistics</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{completed}</p>
            <p className="text-xs text-muted-foreground mt-1">Rows Completed</p>
          </div>
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-xs text-muted-foreground mt-1">Completion</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <h3 className="text-sm font-semibold">Row Status</h3>
          {completedRows.map((done, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--tile-correct)] shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span>Row {i + 1}: {done ? "Complete" : "Incomplete"}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-5">
          <Button
            className="w-full bg-[var(--tile-correct)] hover:bg-[var(--tile-correct)]/90 text-white"
            onClick={handleNewPuzzle}
          >
            New Puzzle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
