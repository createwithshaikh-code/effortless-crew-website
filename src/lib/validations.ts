import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  service_interest: z.string().min(1, "Please select a service"),
  budget_range: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string(),
  cover_image_url: z.string().optional(),
  author_name: z.string().min(1, "Author name is required"),
  author_avatar_url: z.string().optional(),
  tags: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

export const portfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  client_name: z.string().min(1, "Client name is required"),
  service_id: z.string().optional(),
  thumbnail_url: z.string().optional(),
  video_url: z.string().optional(),
  before_video_url: z.string().optional(),
  after_video_url: z.string().optional(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

export type PortfolioItemFormData = z.infer<typeof portfolioItemSchema>;
