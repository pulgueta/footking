import { useState } from "react";

import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Field } from "api/db";

import { AddSoccerFieldDialog } from "@/components/add-field";
import { FieldAvailabilityManager } from "@/components/availability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

const HomeComponent = () => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const { data } = useSession();
  const { data: fields } = useSuspenseQuery(getOwnerFields(data?.user.id ?? ""));

  return (
    <main>
      <header className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Tus canchas</h2>
        <AddSoccerFieldDialog />
      </header>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fields?.map((field) => (
          <Card
            key={field.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => setSelectedField(field)}
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
        <FieldAvailabilityManager field={selectedField} onClose={() => setSelectedField(null)} />
      )}
    </main>
  );
};

const getOwnerFields = (ownerId: string) =>
  queryOptions({
    queryKey: ["fields"],
    queryFn: async () => {
      const fields = await api.fields[":ownerId"].$get({
        param: {
          ownerId,
        },
      });

      const json = await fields.json();

      return json.fields;
    },
  });

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: () => {
    const queryClient = new QueryClient();

    const { data } = useSession();

    if (!data) {
      return;
    }

    queryClient.ensureQueryData(getOwnerFields(data?.user.id));
  },
});
