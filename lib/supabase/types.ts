export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          ingredients: string[];
          instructions: string[];
          cooking_time: number | null;
          difficulty: "easy" | "medium" | "hard";
          category: string;
          image_url: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          ingredients: string[];
          instructions: string[];
          cooking_time?: number | null;
          difficulty?: "easy" | "medium" | "hard";
          category: string;
          image_url?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          ingredients?: string[];
          instructions?: string[];
          cooking_time?: number | null;
          difficulty?: "easy" | "medium" | "hard";
          category?: string;
          image_url?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          rating?: number;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
export type Rating = Database["public"]["Tables"]["ratings"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
