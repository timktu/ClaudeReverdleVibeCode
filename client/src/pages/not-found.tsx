import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-6xl font-black">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Button asChild>
        <Link href="/">Back to Game</Link>
      </Button>
    </div>
  );
}
