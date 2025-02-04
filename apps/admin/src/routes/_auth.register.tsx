import { createFileRoute } from "@tanstack/react-router";

import { RegisterForm } from "@/components/register-form";

const RouteComponent = () => {
  return (
    <div className="flex min-h-[calc(100dvh-64px)] w-full items-center justify-center bg-muted p-6 md:p-4">
      <RegisterForm />
    </div>
  );
};

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});
