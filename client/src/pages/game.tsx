import { useEffect } from "react";
import { motion, AnimatePresence, useAnimationControls } from "motion/react";
import { toast } from "sonner";
import { AlertCircle, RotateCcw, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GameHeader from "@/components/game-header";
import PuzzleBoard from "@/components/puzzle-board";
import Keyboard from "@/components/keyboard";
import { usePuzzle } from "@/hooks/use-puzzle";
import { useRowChecker } from "@/hooks/use-row-checker";
import { useGameStore } from "@/stores/game-store";

export default function GamePage() {
  const { data: puzzle, isLoading, error } = usePuzzle();
  const { resetGame, gameCompleted, completedRows, isRowComplete } = useGameStore();
  const { checkRow, isPending } = useRowChecker();
  // Bounce lives on a nested element (scale only); the outer overlay keeps its
  // own declarative entrance so it reliably mounts and stays put.
  const bounceControls = useAnimationControls();

  useEffect(() => {
    toast("Welcome to Reverdle!", {
      description: "Fill each row with the word that matches its hint.",
      duration: 4000,
    });
  }, []);

  useEffect(() => {
    if (gameCompleted) {
      toast.success("Puzzle complete!", {
        description: "You solved today's Reverdle! 🎉",
        duration: 6000,
      });
    }
  }, [gameCompleted]);

  const handleCheckAll = async () => {
    // Already solved — nothing left to check, so draw attention to the
    // completion banner with a bounce instead of a misleading toast.
    if (gameCompleted) {
      bounceControls.start({
        scale: [1, 1.08, 0.96, 1.04, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
      return;
    }

    let anyChecked = false;
    let anyWrong = false;

    for (let row = 0; row < 5; row++) {
      if (!completedRows[row] && isRowComplete(row)) {
        anyChecked = true;
        await checkRow(row);
      } else if (!completedRows[row]) {
        anyWrong = true;
      }
    }

    if (!anyChecked) toast.info("Fill in a row first!");
    else if (anyWrong) toast.info("Some rows still need to be filled in.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading puzzle…</p>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">Failed to load puzzle</h1>
        <p className="text-muted-foreground max-w-xs">
          {error instanceof Error ? error.message : "An unexpected error occurred."}
        </p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <GameHeader />

      <main className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-4 py-5 gap-5">
        <AnimatePresence>
          {gameCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <motion.div
                animate={bounceControls}
                className="w-full rounded-lg bg-[var(--tile-correct)]/15 border border-[var(--tile-correct)]/40 px-4 py-3 text-center text-sm font-semibold text-[var(--tile-correct)]"
              >
                Puzzle complete! 🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <PuzzleBoard puzzle={puzzle} />

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Fill each row with the 5-letter word matching its hint.
          <br />
          Press <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-xs">Enter</kbd> or tap Check to validate.
        </p>

        <Keyboard />

        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={resetGame}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <Button
            className="flex-1 gap-2 bg-[var(--tile-correct)] hover:bg-[var(--tile-correct)]/90 text-white"
            onClick={handleCheckAll}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Check All
          </Button>
        </div>
      </main>
    </div>
  );
}
