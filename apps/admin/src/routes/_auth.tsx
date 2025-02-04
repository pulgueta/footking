import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";

import { useSession } from "@/lib/auth-client";

const AuthLayout = () => {
  const navigate = useNavigate();

  const { user } = useSession();

  if (user) {
    navigate({
      to: "/$id",
      params: {
        id: user.id,
      },
      viewTransition: true,
    });
  }

  return (
    <div className="min-h-[calc(100dvh-64px)]">
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});
