export interface DailyPuzzle {
  /**
   * The key word every row's tiles are colored against. It need not be one of
   * the 5 grid words below.
   */
  solution: string;
  /** The 5 words that populate the 5x5 grid, one per row. */
  hints: { text: string; answer: string }[];
}

export const dailyPuzzles: DailyPuzzle[] = [
  {
    solution: "RINGS",
    hints: [
      { text: "A color of the rainbow", answer: "GREEN" },
      { text: "Planet closest to the sun", answer: "VENUS" },
      { text: "Bird that can't fly", answer: "KIWIS" },
      { text: "Capital of France", answer: "PARIS" },
      { text: "Lux", answer: "LIGHT" },
    ],
  },
  {
    solution: "LIVES",
    hints: [
      { text: "Medium instrument", answer: "VIOLA" },
      { text: "Virtues and ___", answer: "VICES" },
      { text: "Lab equipment", answer: "VIALS" },
      { text: "The Spanish view", answer: "VISTA" },
      { text: "Rests in Graceland", answer: "ELVIS" },
    ],
  },
  {
    solution: "TASTY",
    hints: [
      { text: "Like sailors and gamers", answer: "SALTY" },
      { text: "For bakers and biologists", answer: "YEAST" },
      { text: "Romulus and Remus", answer: "TWINS" },
      { text: "Before key and after stick", answer: "SHIFT" },
      { text: "Spiritual bears?", answer: "YOGIS" },
    ],
  },
  {
    solution: "CLIPS",
    hints: [
      { text: "1/1000 of a wish", answer: "CRANE" },
      { text: "Not quite buckets", answer: "PAILS" },
      { text: "Part of a popular craze", answer: "TULIP" },
      { text: "ZIP, ZERO, ___", answer: "ZILCH" },
      { text: "Snowplow or wedge", answer: "PIZZA" },
    ],
  },
  {
    solution: "CHART",
    hints: [
      { text: "Vowel checker", answer: "ADIEU" },
      { text: "Cymbal sound", answer: "CRASH" },
      { text: "All a___ !", answer: "BOARD" },
      { text: "After strawberry or pimple", answer: "PATCH" },
      { text: "Thing to avoid while driving", answer: "DITCH" },
    ],
  },
];
