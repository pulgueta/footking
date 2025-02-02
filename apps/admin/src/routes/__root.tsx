import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { QueryClient } from "@tanstack/react-query";

import { Heading, Paragraph } from "@/components/ui/typography";
import { useSession } from "@/lib/auth-client";

const RootLayout = () => {
  const { user } = useSession();

  return (
    <>
      <header className="flex h-16 items-center justify-between px-4">
        <Heading as="h2">
          <Link to="/$id" params={{ id: "2" }}>
            FootKing
          </Link>
        </Heading>
        <nav>
          <div className="flex items-center gap-x-4">
            <Paragraph>
              <Link
                to="/$id"
                activeProps={{
                  className: "font-bold",
                }}
                params={{ id: user?.id ?? "1" }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>
            </Paragraph>
            <Link
              to="/about"
              activeProps={{
                className: "font-bold",
              }}
            >
              About
            </Link>
          </div>
        </nav>
      </header>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
