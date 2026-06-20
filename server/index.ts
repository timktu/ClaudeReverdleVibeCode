import express from "express";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());

const server = registerRoutes(app);

// In production, serve the built client.
// In dev, mount Vite as middleware so this single port serves both the
// API (registered above) and the client app.
if (process.env.NODE_ENV === "production") {
  const { default: path } = await import("path");
  const { fileURLToPath } = await import("url");
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, "public")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const PORT = Number(process.env.PORT ?? 5000);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
