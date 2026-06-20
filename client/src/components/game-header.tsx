import { useState } from "react";
import { HelpCircle, BarChart4, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/game-store";
import HelpModal from "@/components/help-modal";
import StatsModal from "@/components/stats-modal";

export default function GameHeader() {
  const { darkMode, setDarkMode } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setShowHelp(true)}
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <h1 className="text-2xl md:text-3xl font-black tracking-widest text-foreground select-none">
          REVERDLE
        </h1>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setShowStats(true)}
            aria-label="Statistics"
          >
            <BarChart4 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
      <StatsModal open={showStats} onOpenChange={setShowStats} />
    </>
  );
}
