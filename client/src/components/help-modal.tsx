import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TILE_COLORS = {
  correct: "bg-[var(--tile-correct)]",
  present: "bg-[var(--tile-present)]",
  absent: "bg-[var(--tile-absent)]",
};

function ExampleTile({
  letter,
  color,
}: {
  letter: string;
  color: keyof typeof TILE_COLORS;
}) {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center text-xl font-bold rounded text-white ${TILE_COLORS[color]}`}
    >
      {letter}
    </div>
  );
}

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How to Play</DialogTitle>
        </DialogHeader>

        <ul className="mt-3 list-disc pl-5 space-y-1.5 text-sm">
          <li>Fill each row with the 5-letter word that matches its hint.</li>
          <li>Click a tile or hint row to focus that row.</li>
          <li>Press Enter or the Check button to validate a row.</li>
          <li>Complete all five rows to solve the puzzle!</li>
        </ul>

        <div className="mt-5 space-y-4">
          <h3 className="font-semibold">Tile colors</h3>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["G", "R", "E", "E", "N"].map((l, i) => (
                  <ExampleTile key={i} letter={l} color={i === 0 ? "correct" : "absent"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>G</strong> is in the right position.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {["F", "L", "U", "T", "E"].map((l, i) => (
                  <ExampleTile key={i} letter={l} color={i === 1 ? "present" : "absent"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>L</strong> is in the solution but wrong position.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
