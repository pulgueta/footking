import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { object, string } from "zod";

import { AddSoccerFieldDialog } from "@/components/add-field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { cacheKeys } from "api/cache-keys";
import { ErrorComponent } from "@/components/error-component";
import { LoadingComponent } from "@/components/loading-component";
import { Paragraph } from "@/components/ui/typography";
import { formatPrice } from "@/lib/utils";

const HomeComponent = () => {
  const navigate = useNavigate();
  const { id } = Route.useParams();

  const { user } = useSession();

  if (!user || (user.id !== id && id.length < 6)) {
    navigate({
      from: "/$id",
      to: "/login",
      viewTransition: true,
    });
  }

  // @ts-expect-error
  const { data: fields } = useSuspenseQuery(getOwnerFields(user?.id));

  return (
    <main className="p-4">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Tus canchas</h2>
        <AddSoccerFieldDialog />
      </header>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <Card key={field.id} className="cursor-pointer transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>{field.name}</CardTitle>
              <CardDescription>{formatPrice(field.hourlyRate)} COP/h</CardDescription>
            </CardHeader>
            <CardContent>
              <Paragraph muted weight="normal">
                {field.city}, {field.state}
              </Paragraph>
              <Paragraph muted weight="normal">
                {field.address}
              </Paragraph>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
};

const getOwnerFields = (ownerId: string) =>
  queryOptions({
    queryKey: [cacheKeys.fields, ownerId],
    queryFn: async () => {
      const query = await api.fields.$get({
        query: {
          ownerId,
        },
      });

      const response = await query.json();

      return response;
    },
  });

const ownerIdSearchSchema = object({
  ownerId: fallback(string().min(6), ""),
});

export const Route = createFileRoute("/$id")({
  pendingComponent: LoadingComponent,
  component: HomeComponent,
  params: zodSearchValidator(ownerIdSearchSchema),
  errorComponent: (error) => <ErrorComponent {...error} />,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(getOwnerFields(id)),
});
