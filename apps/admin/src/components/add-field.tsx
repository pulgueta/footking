import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateField, FieldAvailability } from "api/db";
import { createFieldSchema } from "api/db";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColombia } from "@/hooks/use-colombia";
import { createField } from "@/services/field";
import { cacheKeys } from "api/cache-keys";
// import { useSession } from "@/lib/auth-client";

const defaultAvailability: FieldAvailability = {
  Lunes: { open: "06:00", close: "22:00" },
  Martes: { open: "06:00", close: "22:00" },
  Miércoles: { open: "06:00", close: "22:00" },
  Jueves: { open: "06:00", close: "22:00" },
  Viernes: { open: "06:00", close: "22:00" },
  Sábado: { open: "06:00", close: "22:00" },
  Domingo: { open: "06:00", close: "22:00" },
};

export const AddSoccerFieldDialog = () => {
  const queryClient = useQueryClient();

  // const { user } = useSession();

  const form = useForm<CreateField>({
    resolver: zodResolver(createFieldSchema),
    defaultValues: {
      name: "",
      address: "",
      state: "",
      hourlyRate: 0,
      city: "",
      availability: defaultAvailability,
      userId: "1",
    },
  });

  const mutation = useMutation({
    mutationFn: createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.fields] });
      form.reset();
    },
  });

  console.log(form.getValues());

  const { states, citiesFromState } = useColombia();

  const selectedState = form.watch("state");

  const onSubmit = form.handleSubmit(async (data: CreateField) => {
    await mutation.mutateAsync(data);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Añadir nueva cancha</Button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-h-[540px] w-full max-w-sm overflow-y-scroll rounded-xl md:max-h-full md:max-w-lg md:overflow-y-hidden">
        <DialogHeader>
          <DialogTitle>Añadir cancha</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid w-full gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la cancha</FormLabel>
                  <FormControl>
                    <Input placeholder="Cancha Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Principal #123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map(({ state }) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!!selectedState && (
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una ciudad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {citiesFromState(selectedState).map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor la hora</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <div className="flex h-9 items-center justify-center rounded-l border border-r-0 bg-muted px-3 py-1">
                        <DollarSign className="size-4" />
                      </div>
                      <Input
                        className="rounded-l-none border-l-0"
                        placeholder="100000"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Horario de disponibilidad</FormLabel>

              <div className="grid gap-4 rounded-lg border p-4">
                {Object.entries(defaultAvailability).map(([day, times]) => (
                  <div
                    key={day}
                    className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center"
                  >
                    <span className="w-24 font-medium text-sm">{day}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        className="w-32"
                        defaultValue={times.open}
                        onChange={(e) => {
                          const current = form.getValues("availability");
                          form.setValue("availability", {
                            ...current,
                            [day]: { ...current[day], open: e.target.value },
                          });
                        }}
                      />
                      <span>a</span>
                      <Input
                        type="time"
                        className="w-32"
                        defaultValue={times.close}
                        onChange={(e) => {
                          const current = form.getValues("availability");
                          form.setValue("availability", {
                            ...current,
                            [day]: { ...current[day], close: e.target.value },
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Agregando..." : "Agregar cancha"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
