import { useState } from "react";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Field } from "api/db";

import { AddSoccerFieldDialog } from "@/components/add-field";
import { BookingForm } from "@/components/availability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheKeys } from "api/cache-keys";

const HomeComponent = () => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const { user } = useSession();

  const { data: fields } = useSuspenseQuery(getOwnerFields(user?.id ?? "2"));

  return (
    <main className="p-4">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Tus canchas</h2>
        <AddSoccerFieldDialog />
      </header>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <Card
            key={field.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() =>
              setSelectedField({
                ...field,
                createdAt: field.createdAt ? new Date(field.createdAt) : null,
                updatedAt: field.updatedAt ? new Date(field.updatedAt) : null,
              })
            }
          >
            <CardHeader>
              <CardTitle>{field.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                {field.address}, {field.state}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      {selectedField && (
        <BookingForm field={selectedField} onClose={() => {}} userId={selectedField.userId} />
      )}
    </main>
  );
};

const getOwnerFields = (ownerId: string) =>
  queryOptions({
    queryKey: [cacheKeys.fields, ownerId],
    queryFn: async () => {
      const fields = await api.fields.$get({
        query: {
          ownerId,
        },
      });

      return await fields.json();
    },
  });

export const Route = createFileRoute("/$id")({
  pendingComponent: () => <Skeleton className="h-96" />,
  component: HomeComponent,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(getOwnerFields(id)),
});
