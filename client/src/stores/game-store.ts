import { create } from "zustand";

export type TileStatus = "empty" | "filled" | "correct" | "present" | "absent";

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
  checkedRows: boolean[];
  darkMode: boolean;
  gameCompleted: boolean;

  setDarkMode: (dark: boolean) => void;
  selectCell: (row: number, col: number) => void;
  updateTile: (row: number, col: number, letter: string) => void;
  markRowCompleted: (rowIndex: number) => void;
  markRowShake: (rowIndex: number) => void;
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
  checkedRows: Array(5).fill(false),
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

  markRowShake: (rowIndex) => {
    set((state) => {
      const checkedRows = [...state.checkedRows];
      checkedRows[rowIndex] = true;
      return { checkedRows };
    });
    setTimeout(() => {
      set((state) => {
        const checkedRows = [...state.checkedRows];
        checkedRows[rowIndex] = false;
        return { checkedRows };
      });
    }, 450);
  },

  setGameCompleted: (completed) => set({ gameCompleted: completed }),

  resetGame: () =>
    set({
      grid: createEmptyGrid(),
      currentRow: null,
      currentCol: null,
      completedRows: Array(5).fill(false),
      checkedRows: Array(5).fill(false),
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
