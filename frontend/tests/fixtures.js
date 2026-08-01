/**
 * Shared test fixtures and mock data for Pawport Transport E2E tests.
 */

export const MOCK_USER = {
  id: 'user-uuid-123',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  created_at: '2025-01-15T10:00:00.000Z',
}

export const MOCK_TOKEN = 'mock-jwt-token-for-testing'

export const MOCK_BOOKING = {
  id: 'booking-uuid-001',
  user_id: 'user-uuid-123',
  pet_category: 'Dog — Small (under 10 kg)',
  pet_name: 'Bruno',
  booking_date: '2025-08-20',
  user_email: 'priya@example.com',
  user_name: 'Priya Sharma',
  pickup_place: 'Coimbatore, Tamil Nadu',
  dropoff_place: 'Bangalore, Karnataka',
  preferred_time: 'Morning (9 AM – 12 PM)',
  notes: 'Friendly dog, needs water breaks',
  status: 'pending',
  handler_id: null,
  tracking_link: null,
  created_at: '2025-07-16T08:30:00.000Z',
  updated_at: '2025-07-16T08:30:00.000Z',
}

export const MOCK_BOOKING_IN_TRANSIT = {
  ...MOCK_BOOKING,
  id: 'booking-uuid-002',
  status: 'in-transit',
  pet_name: 'Luna',
  pickup_place: 'Chennai, Tamil Nadu',
  dropoff_place: 'Hyderabad, Telangana',
}

export const MOCK_BOOKING_COMPLETED = {
  ...MOCK_BOOKING,
  id: 'booking-uuid-003',
  status: 'completed',
  pet_name: 'Max',
  pickup_place: 'Mumbai, Maharashtra',
  dropoff_place: 'Pune, Maharashtra',
}

export const MOCK_BOOKINGS = [
  MOCK_BOOKING,
  MOCK_BOOKING_IN_TRANSIT,
  MOCK_BOOKING_COMPLETED,
]

/**
 * Set up API route mocks for a page.
 * @param {import('@playwright/test').Page} page
 * @param {object} options - Override default mock responses
 */
export async function setupApiMocks(page, options = {}) {
  const {
    user = MOCK_USER,
    token = MOCK_TOKEN,
    bookings = MOCK_BOOKINGS,
    loginError = null,
    registerError = null,
    bookingError = null,
  } = options

  // Auth: login
  await page.route('**/api/auth/login', async (route) => {
    if (loginError) {
      return route.fulfill({
        status: loginError.status || 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: loginError.message }),
      })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token, user }),
    })
  })

  // Auth: register
  await page.route('**/api/auth/register', async (route) => {
    if (registerError) {
      return route.fulfill({
        status: registerError.status || 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: registerError.message }),
      })
    }
    return route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ token, user }),
    })
  })

  // Auth: profile
  await page.route('**/api/auth/profile', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user }),
    })
  })

  // Bookings: list
  await page.route('**/api/bookings', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(bookings),
      })
    }
    if (route.request().method() === 'POST') {
      if (bookingError) {
        return route.fulfill({
          status: bookingError.status || 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: bookingError.message }),
        })
      }
      const body = route.request().postDataJSON()
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          ...MOCK_BOOKING,
          ...body,
          id: 'booking-new-' + Date.now(),
          status: 'pending',
          created_at: new Date().toISOString(),
        }),
      })
    }
    return route.continue()
  })

  // Services
  await page.route('**/api/services', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'svc-1', title: 'Ground Transport', is_active: true },
        { id: 'svc-2', title: 'Flight Escort', is_active: true },
      ]),
    })
  })

  // Health check
  await page.route('**/api/health', async (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
    })
  })
}

/**
 * Inject auth token into localStorage before page load.
 * @param {import('@playwright/test').Page} page
 */
export async function setAuthState(page) {
  await page.addInitScript(([token, user]) => {
    localStorage.setItem('token', token)
    // Zustand store reads token from localStorage; user is set after fetchProfile
    window.__testUser = user
  }, [MOCK_TOKEN, MOCK_USER])
}