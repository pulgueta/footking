import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import type { TypeOf } from "zod";
import { coerce, object, string } from "zod";

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
import { addSoccerField } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";

export const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  // ... add all other states
];

const formSchema = object({
  name: string().min(1, "Field name is required"),
  address: string().min(1, "Address is required"),
  state: string().min(1, "State is required"),
  hourlyRate: coerce.number().min(0, "Hourly rate must be greater than 0"),
});

export const AddSoccerFieldDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<TypeOf<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      state: "",
    },
  });

  const mutation = useMutation({
    mutationFn: addSoccerField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soccerFields"] });
      setOpen(false);
      form.reset();
    },
  });

  function onSubmit(values: TypeOf<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Añadir nueva cancha</Button>
      </DialogTrigger>
      <DialogContent className="container rounded">
        <DialogHeader>
          <DialogTitle>Añadir cancha</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la cancha</FormLabel>
                  <FormControl>
                    <Input placeholder="Cancha La exótica" {...field} />
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
                    <Input placeholder="Carrera 43 #12-34 barrio Segundo de Abril" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione su departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor la hora</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <div className="flex items-center">
                        <div className="flex h-9 items-center justify-center rounded-l border border-r-0 bg-muted px-3 py-1">
                          <DollarSign className="size-4" />
                        </div>
                        <Input
                          className="rounded-l-none border-l-0"
                          placeholder="100.000"
                          type="number"
                        />
                      </div>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Agregando..." : "Agregar cancha"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
