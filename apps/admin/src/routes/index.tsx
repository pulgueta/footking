import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

const HomeComponent = () => {
  const { user } = useSession();

  return (
    <main className="p-4">
      <article className="mx-auto flex w-full max-w-xs items-center justify-center rounded border p-4">
        <Button asChild>
          <Link to="/$id" params={{ id: user!.id }}>
            Ir a mis canchas
          </Link>
        </Button>
      </article>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
