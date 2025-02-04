import { Outlet, createFileRoute } from "@tanstack/react-router";

const AuthLayout = () => (
  <div className="min-h-[calc(100dvh-64px)]">
    <Outlet />
  </div>
);

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});
