export interface Hint {
  id: number;
  rowIndex: number;
  text: string;
  answer: string;
}

export interface PuzzleData {
  id: number;
  name: string;
  hints: Hint[];
  /**
   * The key word every row is scored against. This is a separate word that
   * may or may not appear among the 5 grid rows.
   */
  solution: string;
}

export interface CheckRowRequest {
  rowIndex: number;
  guess: string;
}

export interface LetterResult {
  letter: string;
  status: "correct" | "present" | "absent";
}

export interface CheckRowResponse {
  isCorrect: boolean;
  result: LetterResult[];
}
