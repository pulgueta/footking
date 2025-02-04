"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Field, CreateBooking } from "api/db";
import { createBookingSchema } from "api/db";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingFormProps = {
  field: Field;
  userId: Field["userId"];
};

export const BookingForm = ({ field, userId }: BookingFormProps) => {
  const [_, setSelectedDay] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();

  const form = useForm<CreateBooking>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      userId,
      fieldId: field.id,
      day: "",
      startHour: "",
      endHour: "",
    },
  });

  const mutation = useMutation<void, Error, CreateBooking>({
    mutationFn: () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const onSubmit = (data: CreateBooking) => {
    mutation.mutate(data);
  };

  const getAvailableHours = useCallback(
    (day: string) => {
      const dayAvailability = field.availability[day];
      if (!dayAvailability) return [];

      const { open, close } = dayAvailability;
      const hours: string[] = [];
      let currentHour = open;

      while (currentHour < close) {
        hours.push(currentHour);
        const [h, m] = currentHour.split(":");
        let hour = parseInt(h);
        hour = (hour + 1) % 24;
        currentHour = `${hour.toString().padStart(2, "0")}:${m}`;
      }

      return hours;
    },
    [field.availability],
  );

  const dayOptions = Object.keys(field.availability).map((day) => ({
    label: day,
    value: day,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{field.name}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reservar {field.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="day"
              render={({ field: dayField }) => (
                <FormItem>
                  <FormLabel>Día</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      dayField.onChange(value);
                      setSelectedDay(new Date());
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un día" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dayOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("day") && (
              <>
                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de inicio</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona hora inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableHours(form.getValues("day")).map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
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
                  name="endHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de fin</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona hora final" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getAvailableHours(form.getValues("day"))
                            .filter((hour) => hour > form.getValues("startHour"))
                            .map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Reservando..." : "Reservar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
