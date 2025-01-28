import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AddSoccerFieldDialog } from "@/components/add-field";
import { FieldAvailabilityManager } from "@/components/availability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSoccerFields } from "@/lib/api";
import type { SoccerField } from "@/types";

const HomeComponent = () => {
  const [selectedField, setSelectedField] = useState<SoccerField | null>(null);
  const { data: fields } = useQuery({
    queryKey: ["soccerFields"],
    queryFn: fetchSoccerFields,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-2xl">Your Soccer Fields</h2>
        <AddSoccerFieldDialog />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
      {selectedField && (
        <FieldAvailabilityManager field={selectedField} onClose={() => setSelectedField(null)} />
      )}
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
