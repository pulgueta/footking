import "@/index.css";

import { createRoot } from "react-dom/client";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

import { TanstackErrorBoundary, TanstackProvider } from "@/providers/query-provider";
import { routeTree } from "@/routeTree.gen";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient: new QueryClient(),
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <TanstackProvider>
      <TanstackErrorBoundary>
        <RouterProvider router={router} />
      </TanstackErrorBoundary>
    </TanstackProvider>,
  );
}
