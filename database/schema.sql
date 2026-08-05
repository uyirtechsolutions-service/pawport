-- Pawport Transport Database Schema
-- PostgreSQL via Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_category VARCHAR(100),
  pet_name VARCHAR(255),
  booking_date DATE,
  preferred_time VARCHAR(100),
  pickup_place VARCHAR(500) NOT NULL,
  dropoff_place VARCHAR(500) NOT NULL,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  handler_id UUID,
  tracking_link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_num VARCHAR(10),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICE TAGS TABLE
-- ============================================
CREATE TABLE service_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- HANDLERS TABLE
-- ============================================
CREATE TABLE handlers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  certification VARCHAR(255),
  vehicle_type VARCHAR(100),
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 5.0,
  trips_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRACKING UPDATES TABLE
-- ============================================
CREATE TABLE tracking_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(500),
  message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PET IMAGES TABLE (for tracking image URLs)
-- ============================================
CREATE TABLE pet_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id VARCHAR(255),
  image_url VARCHAR(1000) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  buyer_whatsapp VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cleared_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tracking_booking_id ON tracking_updates(booking_id);
CREATE INDEX idx_pet_images_created_at ON pet_images(created_at);
CREATE INDEX idx_pet_images_cleared_at ON pet_images(cleared_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_images ENABLE ROW LEVEL SECURITY;

-- pet_images: only accessible via service role key (backend)
-- No public access - deny all for anon and authenticated users
CREATE POLICY "Deny public access to pet_images" ON pet_images
  FOR ALL USING (false);

-- Users can read their own data
CREATE POLICY "Users read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Bookings: users can read their own bookings
CREATE POLICY "Users read own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Bookings: users can create bookings for themselves
CREATE POLICY "Users create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Bookings: users can update their own bookings
CREATE POLICY "Users update own bookings" ON bookings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Bookings: users can delete their own bookings
CREATE POLICY "Users delete own bookings" ON bookings
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Tracking: users can read tracking for their bookings
CREATE POLICY "Users read tracking for own bookings" ON tracking_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = tracking_updates.booking_id
      AND bookings.user_id::text = auth.uid()::text
    )
  );

-- ============================================
-- SEED DATA: DEFAULT SERVICES
-- ============================================
INSERT INTO services (id, service_num, title, description, image_url) VALUES
  (uuid_generate_v4(), '01', 'Ground Transport',
   'Climate-controlled vans with secure crating, water and rest stops, for trips across the city or across states.',
   '/images/service-ground.jpg'),
  (uuid_generate_v4(), '02', 'Flight Escort',
   'A dedicated handler flies with your pet — in-cabin or cargo-hold — from check-in to baggage claim.',
   '/images/service-flight.jpg'),
  (uuid_generate_v4(), '03', 'International Relocation',
   'Import permits, health certificates and customs paperwork handled end to end for moving abroad.',
   '/images/service-relocation.jpg'),
  (uuid_generate_v4(), '04', 'Local Pet Taxi',
   'On-demand rides to the vet, groomer or daycare, booked in minutes with a tracked pickup window.',
   '/images/service-taxi.jpg');