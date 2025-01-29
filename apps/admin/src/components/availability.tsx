import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Field } from "api/db";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateFieldAvailability } from "@/lib/api";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

type FieldAvailabilityManagerProps = {
  field: Field;
  onClose: () => void;
};

export const FieldAvailabilityManager = ({ field, onClose }: FieldAvailabilityManagerProps) => {
  const [availability, setAvailability] = useState(field.availability || {});
  const [globalHours, setGlobalHours] = useState("");
  const [applyToAll, setApplyToAll] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateFieldAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soccerFields"] });
      onClose();
    },
  });

  const handleAvailabilityChange = (day: string, isAvailable: boolean) => {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], isAvailable } }));
  };

  const handleHoursChange = (day: string, hours: string) => {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], hours } }));
  };

  const handleGlobalHoursChange = () => {
    if (applyToAll) {
      const updatedAvailability = { ...availability };
      daysOfWeek.forEach((day) => {
        updatedAvailability[day] = { ...updatedAvailability[day], hours: globalHours };
      });
      setAvailability(updatedAvailability);
    } else {
      const updatedAvailability = { ...availability };
      selectedDays.forEach((day) => {
        updatedAvailability[day] = { ...updatedAvailability[day], hours: globalHours };
      });
      setAvailability(updatedAvailability);
    }
  };

  const handleSave = () => {
    mutation.mutate({ fieldId: field.id, availability });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm rounded md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gestionar Disponibilidad del Campo - {field.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="ej. 9:00 AM - 5:00 PM"
              value={globalHours}
              onChange={(e) => setGlobalHours(e.target.value)}
            />
            <Button onClick={handleGlobalHoursChange}>Aplicar Horario</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="applyToAll"
              checked={applyToAll}
              onCheckedChange={(checked) => setApplyToAll(checked as boolean)}
            />
            <Label htmlFor="applyToAll">Aplicar a todos los días</Label>
          </div>
          {!applyToAll && (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDays([...selectedDays, day]);
                      } else {
                        setSelectedDays(selectedDays.filter((d) => d !== day));
                      }
                    }}
                  />
                  <Label htmlFor={`day-${day}`}>{day}</Label>
                </div>
              ))}
            </div>
          )}
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center justify-between">
              <Label htmlFor={`switch-${day}`}>{day}</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  placeholder="ej. 9:00 AM - 5:00 PM"
                  value={availability[day]?.hours || ""}
                  onChange={(e) => handleHoursChange(day, e.target.value)}
                  className="w-48"
                />
                <Switch
                  id={`switch-${day}`}
                  checked={availability[day]?.isAvailable || false}
                  onCheckedChange={(checked) => handleAvailabilityChange(day, checked)}
                />
              </div>
            </div>
          ))}
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? "Guardando..." : "Guardar Disponibilidad"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
