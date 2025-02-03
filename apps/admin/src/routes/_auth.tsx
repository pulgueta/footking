import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { Heading } from "@/components/ui/typography";

const AuthLayout = () => {
  return (
    <>
      <header className="flex h-16 items-center justify-between px-4">
        <Heading as="h2">
          <Link to="/$id" params={{ id: "2" }}>
            Auth
          </Link>
        </Heading>
      </header>
      <hr />
      <Outlet />
    </>
  );
};

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});
