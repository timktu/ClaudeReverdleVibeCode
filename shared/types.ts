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
