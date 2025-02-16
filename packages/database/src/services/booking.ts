import { sql } from "drizzle-orm";

import { db } from "..";
import { deleteCacheKey, getCacheKey, setCacheKey } from "../cache";
import { cacheKeys } from "../cache/cache-keys";
import type { Booking, BookingWithField, CreateBooking, Field } from "../schema";
import { bookingTable } from "../schema/booking";
import { getFieldByName } from "./owner";

export async function createBooking(bookingData: CreateBooking) {
  const isBooked = await isHourBooked(bookingData);

  if (isBooked) {
    return false;
  }

  const bookingValue = await getFieldHourlyRate(bookingData.fieldId);
  const parsedStart = Number(bookingData.startHour.split(":")[0]);
  const parsedEndHour = Number(bookingData.endHour.split(":")[0]);

  await Promise.all([
    db.insert(bookingTable).values({
      ...bookingData,
      bookingTotalValue: sql<number>`(${parsedEndHour} - ${parsedStart}) * ${bookingValue}`,
    }),
    deleteCacheKey(cacheKeys.bookings),
  ]);
}

export async function isHourBooked(
  data: Pick<Booking, "startHour" | "endHour" | "day" | "fieldId">,
) {
  const existingBookings = await getBookingsFromField(data.fieldId);

  return existingBookings.some(
    (booking) =>
      booking.startHour === data.startHour &&
      booking.endHour === data.endHour &&
      booking.day === data.day,
  );
}

export async function getFieldHourlyRate(fieldId: Field["id"]) {
  const field = await db.query.fieldTable.findFirst({
    where: (t, { eq }) => eq(t.id, fieldId),
    columns: {
      hourlyRate: true,
    },
  });

  return field?.hourlyRate;
}

export async function getBookingsFromField(fieldId: Field["id"]) {
  const cachedBookings = await getCacheKey<BookingWithField[]>(cacheKeys.bookings);

  if (cachedBookings) {
    return cachedBookings;
  }

  const bookings = await db.query.bookingTable.findMany({
    where: (t, { eq }) => eq(t.fieldId, fieldId),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
    with: {
      field: true,
    },
  });

  await setCacheKey(cacheKeys.bookings, bookings);

  return bookings;
}

export async function getBookingsByReservationName(name: Booking["reservedBy"]) {
  const cachedBookings = await getCacheKey<Booking[]>(`${cacheKeys.bookings}${name}`);

  if (cachedBookings) {
    return cachedBookings;
  }

  const bookings = await db.query.bookingTable.findMany({
    where: (t, { eq }) => eq(t.reservedBy, name),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  await setCacheKey(`${cacheKeys.bookings}${name}`, bookings);

  return bookings;
}

export async function getBookingByReservationName(name: Booking["reservedBy"]) {
  const cachedBooking = await getCacheKey<Booking>(`${cacheKeys.booking}:${name}`);

  if (cachedBooking) {
    return cachedBooking;
  }

  const bookings = await db.query.bookingTable.findFirst({
    where: (t, { eq }) => eq(t.reservedBy, name),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  await setCacheKey(`${cacheKeys.booking}:${name}`, bookings);

  return bookings;
}

export async function getAvailableBookingHoursForDay(fieldName: string, bookingDay: string) {
  const field = await getFieldByName(fieldName);

  if (!field) {
    throw new Error("Field not found");
  }

  // Convert the provided booking day (YYYY-MM-DD) to a Date object.
  const dateObj = new Date(bookingDay);
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  // Get the weekday name (e.g. "monday") in lowercase.
  const dayName = dateObj.toLocaleString("es-CO", { weekday: "long" }).toLowerCase();

  // Check if there's availability defined for the given weekday.
  const dayAvailability = field.availability[dayName];
  if (!dayAvailability) {
    return { day: dayName, availableHours: [] };
  }

  // Parse the open and close hours from the availability object.
  // We expect times in "HH:mm" format.
  const openHour = parseInt(dayAvailability.open.split(":")[0], 10);
  const closeHour = parseInt(dayAvailability.close.split(":")[0], 10);

  // Create a list of potential one-hour slots from open (inclusive) to close (exclusive).
  const potentialHours: string[] = [];
  for (let hour = openHour; hour < closeHour; hour++) {
    potentialHours.push(hour.toString().padStart(2, "0") + ":00");
  }

  // Retrieve existing bookings for the field and filter to those on the provided day.
  const bookings = await getBookingsFromField(field.id);
  const bookedHoursSet = new Set<string>();
  bookings.forEach((booking) => {
    if (booking.day === bookingDay) {
      const bookedStart = parseInt(booking.startHour.split(":")[0], 10);
      const bookedEnd = parseInt(booking.endHour.split(":")[0], 10);
      // Mark each booked hour slot.
      for (let hour = bookedStart; hour < bookedEnd; hour++) {
        bookedHoursSet.add(hour.toString().padStart(2, "0") + ":00");
      }
    }
  });

  // Filter out the slots that have already been booked.
  const availableHours = potentialHours.filter((hour) => !bookedHoursSet.has(hour));

  return { day: dayName, availableHours };
}
