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
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
