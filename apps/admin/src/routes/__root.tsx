import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { QueryClient } from "@tanstack/react-query";

import { Header } from "@/components/header";

const RootLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      {process.env.NODE_ENV === "development" && <TanStackRouterDevtools position="bottom-right" />}
    </>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
