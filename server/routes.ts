import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { scoreGuess } from "../shared/game-logic.js";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.get("/api/puzzle", (_req, res) => {
    const puzzle = storage.getActivePuzzle();
    res.json(puzzle);
  });

  const checkRowSchema = z.object({
    rowIndex: z.number().int().min(0).max(4),
    guess: z.string().length(5),
  });

  app.post("/api/check-row", (req, res) => {
    const parsed = checkRowSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      return;
    }

    const { rowIndex, guess } = parsed.data;
    const puzzle = storage.getActivePuzzle();

    try {
      res.json(scoreGuess(puzzle, rowIndex, guess));
    } catch {
      res.status(404).json({ message: "Hint not found" });
    }
  });

  return httpServer;
}
