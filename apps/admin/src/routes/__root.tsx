import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Heading, Paragraph } from "@/components/ui/typography";

const RootLayout = () => {
  return (
    <>
      <header className="flex h-16 items-center justify-between px-4">
        <Heading as="h2">
          <Link to="/">FootKing</Link>
        </Heading>
        <nav>
          <div className="flex items-center gap-x-4">
            <Paragraph>
              <Link
                to="/"
                activeProps={{
                  className: "font-bold",
                }}
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

export const Route = createRootRoute({
  component: RootLayout,
});
