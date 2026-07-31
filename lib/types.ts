export type Reaction = "heart" | "joy" | "sad" | "thumbs_up" | "thumbs_down";

export const REACTIONS: Reaction[] = ["heart", "joy", "sad", "thumbs_up", "thumbs_down"];

export interface Post {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
  heart: number;
  joy: number;
  sad: number;
  thumbs_up: number;
  thumbs_down: number;
}

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
}
