import { sql } from "drizzle-orm";

import { deleteCacheKey, getCacheKey, setCacheKey } from "@/cache";
import { cacheKeys } from "@/cache/cache-keys";
import { db } from "@/index";
import type { Booking, BookingWithField, CreateBooking, Field } from "@/schema";
import { bookingTable } from "@/schema/booking";

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
