export interface SiteSettings {
  id: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_reel_url: string | null;
  hero_video_url?: string | null;
  hero_cta_text: string;
  hero_cta_link: string;
  about_headline: string;
  about_body: string;
  about_image_url: string | null;
  stats_json: StatItem[];
  social_links: SocialLinks;
  seo_title: string;
  seo_description: string;
  seo_og_image_url: string | null;
  footer_tagline: string;
  updated_at: string;
}

export interface StatItem {
  label: string;
  value: string;
  suffix: string;
}

export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  icon_name: string;
  features: string[];
  cover_image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  long_description?: string | null;
  deliverables?: string[] | null;
  turnaround?: string | null;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  service_id: string | null;
  service?: Service;
  thumbnail_url: string | null;
  video_url: string | null;
  before_video_url: string | null;
  after_video_url: string | null;
  description: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  results_json: Record<string, string> | null;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  client_avatar_url: string | null;
  content: string;
  rating: number;
  youtube_channel_url: string | null;
  video_testimonial_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  author_avatar_url: string | null;
  tags: string[];
  reading_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  service_id: string | null;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  tagline: string;
  features: PricingFeature[];
  is_featured: boolean;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service_interest: string;
  budget_range: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  ip_address: string | null;
  created_at: string;
}

export type TeamMemberRole = "Video Editor" | "Motion Designer" | "VA" | "Manager";

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  email: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export type ProjectStatus =
  | "brief_received"
  | "in_production"
  | "under_review"
  | "revisions"
  | "delivered"
  | "archived";

export type ProjectPriority = "low" | "normal" | "high" | "urgent";

export interface Project {
  id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  service_type: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string | null;
  assigned_to: string | null;
  team_member?: TeamMember | null;
  raw_footage_url: string | null;
  deliverable_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
