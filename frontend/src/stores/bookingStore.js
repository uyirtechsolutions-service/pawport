import { create } from 'zustand'

export const useBookingStore = create((set) => ({
  currentBooking: null,
  bookings: [],

  setBooking: (booking) => set({ currentBooking: booking }),

  clearBooking: () => set({ currentBooking: null }),

  setBookings: (bookings) => set({ bookings })
}))