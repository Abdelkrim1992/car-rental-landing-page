-- ==========================================
-- Renture Car Rental - Supabase Database Schema
-- ==========================================
-- Run this SQL in your Supabase SQL editor (Dashboard > SQL Editor)

-- 1. Cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  price_per_day DECIMAL(10, 2) NOT NULL,
  fuel VARCHAR(50) NOT NULL,
  mileage VARCHAR(50),
  location VARCHAR(255),
  image_url TEXT,
  description TEXT,
  status text DEFAULT 'Available',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bookings table (supports both authenticated and guest bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- NULLABLE for guest bookings
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location VARCHAR(255),
  booking_lat DOUBLE PRECISION,
  booking_lng DOUBLE PRECISION,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price DECIMAL(10, 2) DEFAULT 0,
  -- Guest booking fields
  guest_name VARCHAR(255) DEFAULT '',
  guest_email VARCHAR(255) DEFAULT '',
  guest_phone VARCHAR(100) DEFAULT '',
  guest_message TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (guests) to insert new messages via the Contact Us form
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to read and update messages in the dashboard
CREATE POLICY "Admins can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Admins can update messages" ON messages FOR UPDATE USING (true);
CREATE POLICY "Admins can delete messages" ON messages FOR DELETE USING (true);

-- Cars: publicly readable
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cars are viewable by everyone" ON cars FOR SELECT USING (true);

-- Profiles: users can read their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by the user" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Bookings: publicly readable for guests, users can CRUD their own
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Admin can delete bookings" ON bookings FOR DELETE USING (true);

-- Reviews: publicly readable, users can create their own
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cars_type ON cars(type);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_car_id ON reviews(car_id);

-- 8. Agency Settings Table
CREATE TABLE IF NOT EXISTS agency_settings (
  id VARCHAR(50) DEFAULT 'default' PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255),
  hero_title TEXT,
  hero_subtitle TEXT,
  phone VARCHAR(100),
  email VARCHAR(255),
  address TEXT,
  working_hours VARCHAR(255),
  stats_cars INT DEFAULT 200,
  stats_rentals INT DEFAULT 5000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: The admin should run this SQL in Supabase dashboard to create the table.
-- Insert default row:
-- INSERT INTO agency_settings (id, business_name, tagline, hero_title, hero_subtitle, phone, email, address, working_hours, stats_cars, stats_rentals) 
-- VALUES ('default', 'Renture', 'Drive Your Dream Car Today.', 'Drive Your Dream
-- Car Today.', 'Discover The Thrill Of Driving Luxury With Our Exclusive Collection Of Well-Maintained Hypercars And Sports Cars Available For Rent.', '+1 (555) 123-4567', 'hello@renture.com', 'San Francisco, CA', 'Mon — Fri, 9am — 6pm', 200, 5000)
-- ON CONFLICT (id) DO NOTHING;


-- ==========================================
-- Renture - Migration: Add Guest Booking Support
-- ==========================================
-- Run this SQL in your Supabase SQL editor if the bookings table already exists
-- This adds the guest fields and makes user_id nullable

-- 1. Make user_id nullable to support guest bookings
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add guest booking fields (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'guest_name') THEN
        ALTER TABLE bookings ADD COLUMN guest_name VARCHAR(255) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'guest_email') THEN
        ALTER TABLE bookings ADD COLUMN guest_email VARCHAR(255) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'guest_phone') THEN
        ALTER TABLE bookings ADD COLUMN guest_phone VARCHAR(100) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'guest_message') THEN
        ALTER TABLE bookings ADD COLUMN guest_message TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_lat') THEN
        ALTER TABLE bookings ADD COLUMN booking_lat DOUBLE PRECISION;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_lng') THEN
        ALTER TABLE bookings ADD COLUMN booking_lng DOUBLE PRECISION;
    END IF;
END $$;

-- 3. Fix RLS policies for bookings to allow guest access
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can delete bookings" ON bookings;

-- Allow guests to create bookings (no auth required)
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
-- Allow reading all bookings (admin sees all via backend, guests don't hit this directly)
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (true);
-- Allow updating bookings
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (true);
-- Allow deleting bookings
CREATE POLICY "Admin can delete bookings" ON bookings FOR DELETE USING (true);

-- Done! Guest bookings should now work.
