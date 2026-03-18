-- Effortless Crew — Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SITE SETTINGS (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hero_headline TEXT NOT NULL DEFAULT 'We Make Creators Look Legendary.',
  hero_subheadline TEXT,
  hero_reel_url TEXT,
  hero_video_url TEXT,
  hero_cta_text TEXT DEFAULT 'Start Your Project',
  hero_cta_link TEXT DEFAULT '/contact',
  about_headline TEXT,
  about_body TEXT,
  about_image_url TEXT,
  stats_json JSONB DEFAULT '[]'::JSONB,
  social_links JSONB DEFAULT '{}'::JSONB,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image_url TEXT,
  footer_tagline TEXT DEFAULT 'Making creators legendary, one frame at a time.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  icon_name TEXT DEFAULT 'Scissors',
  features JSONB DEFAULT '[]'::JSONB,
  long_description TEXT,
  deliverables JSONB DEFAULT '[]'::JSONB,
  turnaround TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PORTFOLIO ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  before_video_url TEXT,
  after_video_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  results_json JSONB DEFAULT '{}'::JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  youtube_channel_url TEXT,
  video_testimonial_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT DEFAULT '',
  cover_image_url TEXT,
  author_name TEXT DEFAULT 'Effortless Crew',
  author_avatar_url TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time_minutes INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRICING PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  price_monthly NUMERIC(10,2) DEFAULT 0,
  price_yearly NUMERIC(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  tagline TEXT,
  features JSONB DEFAULT '[]'::JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  cta_text TEXT DEFAULT 'Get Started',
  cta_link TEXT DEFAULT '/contact',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  service_interest TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Video Editor',
  email TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  service_type TEXT,
  status TEXT DEFAULT 'brief_received'
    CHECK (status IN ('brief_received','in_production','under_review','revisions','delivered','archived')),
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low','normal','high','urgent')),
  deadline TIMESTAMPTZ,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  raw_footage_url TEXT,
  deliverable_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ---- site_settings ----
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated can modify site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ---- services ----
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Authenticated can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- ---- portfolio_items ----
CREATE POLICY "Public can read published portfolio" ON portfolio_items FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Authenticated can manage portfolio" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');

-- ---- testimonials ----
CREATE POLICY "Public can read published testimonials" ON testimonials FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Authenticated can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- ---- blog_posts ----
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Authenticated can manage posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- ---- pricing_packages ----
CREATE POLICY "Public can read active pricing" ON pricing_packages FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Authenticated can manage pricing" ON pricing_packages FOR ALL USING (auth.role() = 'authenticated');

-- ---- contact_submissions ----
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Authenticated can manage submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');

-- ---- team_members ----
CREATE POLICY "Authenticated can manage team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- ---- projects ----
CREATE POLICY "Authenticated can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DEFAULT SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (
  hero_headline,
  hero_subheadline,
  hero_cta_text,
  hero_cta_link,
  about_headline,
  about_body,
  stats_json,
  social_links,
  seo_title,
  seo_description,
  footer_tagline
) VALUES (
  'We Make Creators Look Legendary.',
  'From cinematic long-form edits to viral shorts and stunning motion graphics — we turn raw footage into content that actually converts.',
  'Start Your Project',
  '/contact',
  'Built by Creators, for Creators',
  'We''re a team of passionate video editors and content strategists who''ve spent years perfecting the craft of storytelling through video.',
  '[{"label": "Videos Edited", "value": "500", "suffix": "+"}, {"label": "Happy Clients", "value": "50", "suffix": "+"}, {"label": "Views Generated", "value": "100", "suffix": "M+"}, {"label": "Average Rating", "value": "4.9", "suffix": "/5"}]',
  '{"youtube": "", "instagram": "", "twitter": "", "linkedin": ""}',
  'Effortless Crew — Premium Video Editing Agency',
  'We make creators look legendary. Premium video editing, YouTube automation, motion graphics, and short-form content.',
  'Making creators legendary, one frame at a time.'
);
