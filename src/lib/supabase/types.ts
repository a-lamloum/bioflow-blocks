export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          mission_id: string
          nodes: Json
          edges: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          mission_id?: string
          nodes?: Json
          edges?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          mission_id?: string
          nodes?: Json
          edges?: Json
          updated_at?: string
        }
      }
      mission_progress: {
        Row: {
          id: string
          user_id: string
          mission_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mission_id: string
          completed_at?: string
        }
        Update: never
      }
    }
  }
}
