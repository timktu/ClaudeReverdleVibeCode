import { Route, Router, Switch } from "wouter";
import { Toaster } from "sonner";
import GamePage from "./pages/game.tsx";
import NotFound from "./pages/not-found.tsx";
import { useGameStore } from "./stores/game-store.ts";
import { useEffect } from "react";

export default function App() {
  const darkMode = useGameStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Strip the trailing slash from Vite's BASE_URL so wouter matches routes
  // under the GitHub Pages sub-path ("/repo") and at root ("") in dev.
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <>
      <Router base={base}>
        <Switch>
          <Route path="/" component={GamePage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster
        position="top-center"
        theme={darkMode ? "dark" : "light"}
        richColors
      />
    </>
  );
}
