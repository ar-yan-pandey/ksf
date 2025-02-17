export interface NewsItem {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  image_url: string;
  created_at: string;
  user_id: string;
}