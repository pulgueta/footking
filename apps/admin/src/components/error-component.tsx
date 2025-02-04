import type { FC } from "react";

import { AlertCircle } from "lucide-react";
import type { ErrorComponentProps } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ErrorComponent: FC<ErrorComponentProps> = ({ error, reset }) => {
  return (
    <div className="flex min-h-[calc(100dvh-65px)] items-center justify-center p-4">
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertCircle className="size-4" />
        <AlertTitle>¡Ocurrió un error!</AlertTitle>
        <AlertDescription>
          {error.message}{" "}
          <button onClick={reset} className="cursor-pointer underline-offset-2 hover:underline">
            Intentar otra vez
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
