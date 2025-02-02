import { db } from "@/db/config";
import type { Booking, CreateBooking } from "@/db/schema/booking";
import { bookingTable } from "@/db/schema/booking";
import { deleteCacheKey, getCacheKey, setCacheKey } from "@/utils/cache";
import { cacheKeys } from "@/utils/cache-keys";

export async function createBooking(bookingData: CreateBooking) {
  const existingBooking = await getBookings();

  const isHourBooked = existingBooking.some(
    (booking) =>
      booking.startHour === bookingData.startHour &&
      booking.endHour === bookingData.endHour &&
      booking.day === bookingData.day,
  );

  if (isHourBooked) {
    return false;
  }

  await Promise.all([
    await db.insert(bookingTable).values(bookingData),
    deleteCacheKey(cacheKeys.bookings),
    deleteCacheKey(`${cacheKeys.bookings}${bookingData.userId}`),
  ]);
}

export async function getBookings() {
  const cachedBookings = await getCacheKey<Booking[]>(cacheKeys.bookings);

  if (cachedBookings) {
    return cachedBookings;
  }

  const bookings = await db.query.bookingTable.findMany({
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  await setCacheKey(cacheKeys.bookings, bookings);

  return bookings;
}

export async function getBookingsByUserId(userId: Booking["userId"]) {
  const cachedBookings = await getCacheKey<Booking[]>(`${cacheKeys.bookings}${userId}`);

  if (cachedBookings) {
    return cachedBookings;
  }

  const bookings = await db.query.bookingTable.findMany({
    where: (t, { eq }) => eq(t.userId, userId),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  await setCacheKey(`${cacheKeys.bookings}${userId}`, bookings);

  return bookings;
}

export async function getBookingByUserId(userId: Booking["userId"]) {
  const cachedBooking = await getCacheKey<Booking>(`${cacheKeys.booking}:${userId}`);

  if (cachedBooking) {
    return cachedBooking;
  }

  const bookings = await db.query.bookingTable.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });

  await setCacheKey(`${cacheKeys.booking}:${userId}`, bookings);

  return bookings;
}
