import { Skeleton } from "@/components/ui/skeleton";

export const LoadingComponent = () => {
  return (
    <div className="flex min-h-[calc(100dvh-97px)] items-center justify-center p-4">
      <Skeleton className="min-h-[calc(100dvh-97px)] w-full" />
    </div>
  );
};
