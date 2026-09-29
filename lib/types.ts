export type SiteSettings = {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  about_title: string;
  about_body: string; // Markdown
  about_image: string;
  phone: string;
  mobile: string;
  line_id: string;
  line_url: string;
  instagram_url: string;
  facebook_url: string;
  booking_note: string;
  disclaimer: string;
};

export type Service = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  sort_order: number;
  is_published: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  photo_url: string;
  sort_order: number;
};

export type Location = {
  id: string;
  name: string;
  address: string;
  hours: string;
  transit: string;
  phone: string;
  sort_order: number;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  cover_url: string;
  category: string;
  status: PostStatus;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
