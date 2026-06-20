import { create } from "zustand";

export type TileStatus = "empty" | "filled" | "correct" | "present" | "absent";

/** Transient per-row feedback played right after a check, then cleared. */
export type RowFeedback = "correct" | "incorrect" | null;

export interface Tile {
  letter: string;
  status: TileStatus;
}

const createEmptyGrid = (): Tile[][] =>
  Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => ({ letter: "", status: "empty" as TileStatus }))
  );

interface GameStore {
  grid: Tile[][];
  currentRow: number | null;
  currentCol: number | null;
  completedRows: boolean[];
  rowFeedback: RowFeedback[];
  darkMode: boolean;
  gameCompleted: boolean;

  setDarkMode: (dark: boolean) => void;
  selectCell: (row: number, col: number) => void;
  updateTile: (row: number, col: number, letter: string) => void;
  markRowCompleted: (rowIndex: number) => void;
  flashRow: (rowIndex: number, feedback: Exclude<RowFeedback, null>) => void;
  setGameCompleted: (completed: boolean) => void;
  resetGame: () => void;
  isRowComplete: (rowIndex: number) => boolean;
  findNextEmptyCell: () => [number, number] | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  grid: createEmptyGrid(),
  currentRow: null,
  currentCol: null,
  completedRows: Array(5).fill(false),
  rowFeedback: Array(5).fill(null),
  darkMode:
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  gameCompleted: false,

  setDarkMode: (dark) => set({ darkMode: dark }),

  selectCell: (row, col) => {
    if (get().completedRows[row]) return;
    set({ currentRow: row, currentCol: col });
  },

  updateTile: (row, col, letter) => {
    if (get().completedRows[row]) return;
    set((state) => {
      const grid = state.grid.map((r, ri) =>
        ri === row
          ? r.map((tile, ci) =>
              ci === col
                ? { letter, status: (letter ? "filled" : "empty") as TileStatus }
                : tile
            )
          : r
      );
      return { grid };
    });
  },

  markRowCompleted: (rowIndex) => {
    set((state) => {
      const completedRows = [...state.completedRows];
      completedRows[rowIndex] = true;
      const gameCompleted = completedRows.every(Boolean);
      return { completedRows, gameCompleted };
    });
  },

  flashRow: (rowIndex, feedback) => {
    set((state) => {
      const rowFeedback = [...state.rowFeedback];
      rowFeedback[rowIndex] = feedback;
      return { rowFeedback };
    });
    // Clear once the flash/shake animation has finished so it can replay.
    setTimeout(() => {
      set((state) => {
        if (state.rowFeedback[rowIndex] !== feedback) return state;
        const rowFeedback = [...state.rowFeedback];
        rowFeedback[rowIndex] = null;
        return { rowFeedback };
      });
    }, 600);
  },

  setGameCompleted: (completed) => set({ gameCompleted: completed }),

  resetGame: () =>
    set({
      grid: createEmptyGrid(),
      currentRow: null,
      currentCol: null,
      completedRows: Array(5).fill(false),
      rowFeedback: Array(5).fill(null),
      gameCompleted: false,
    }),

  isRowComplete: (rowIndex) =>
    get().grid[rowIndex].every((tile) => tile.letter !== ""),

  findNextEmptyCell: () => {
    const { grid, completedRows } = get();
    for (let row = 0; row < 5; row++) {
      if (!completedRows[row]) {
        for (let col = 0; col < 5; col++) {
          if (grid[row][col].letter === "") return [row, col];
        }
      }
    }
    return null;
  },
}));
