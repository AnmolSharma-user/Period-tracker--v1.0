export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          cycle_length: number;
          last_period_date: string;
          has_period_reminders: boolean;
          has_pill_reminders: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cycle_length: number;
          last_period_date: string;
          has_period_reminders?: boolean;
          has_pill_reminders?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cycle_length?: number;
          last_period_date?: string;
          has_period_reminders?: boolean;
          has_pill_reminders?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      periods: {
        Row: {
          id: string;
          user_id: string;
          start_date: string;
          end_date: string | null;
          symptoms: Json[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_date: string;
          end_date?: string | null;
          symptoms?: Json[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_date?: string;
          end_date?: string | null;
          symptoms?: Json[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      symptom_types: {
        Row: {
          id: string;
          symptom_name: string;
          symptom_category: string;
          symptom_icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          symptom_name: string;
          symptom_category: string;
          symptom_icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          symptom_name?: string;
          symptom_category?: string;
          symptom_icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          type: "period" | "pill";
          schedule: "daily" | "weekly" | "monthly";
          time: string;
          message: string | null;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "period" | "pill";
          schedule: "daily" | "weekly" | "monthly";
          time: string;
          message?: string | null;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "period" | "pill";
          schedule?: "daily" | "weekly" | "monthly";
          time?: string;
          message?: string | null;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      shared_cycles: {
        Row: {
          id: string;
          user_id: string;
          shared_with_id: string;
          share_code: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shared_with_id: string;
          share_code: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shared_with_id?: string;
          share_code?: string;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for better type inference
export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;

// Type helpers for specific tables
export type Profile = Tables["profiles"]["Row"];
export type NewProfile = Tables["profiles"]["Insert"];
export type UpdateProfile = Tables["profiles"]["Update"];

export type UserPreferences = Tables["user_preferences"]["Row"];
export type NewUserPreferences = Tables["user_preferences"]["Insert"];
export type UpdateUserPreferences = Tables["user_preferences"]["Update"];

export type Period = Tables["periods"]["Row"];
export type NewPeriod = Tables["periods"]["Insert"];
export type UpdatePeriod = Tables["periods"]["Update"];

export type SymptomType = Tables["symptom_types"]["Row"];
export type NewSymptomType = Tables["symptom_types"]["Insert"];
export type UpdateSymptomType = Tables["symptom_types"]["Update"];

export type Reminder = Tables["reminders"]["Row"];
export type NewReminder = Tables["reminders"]["Insert"];
export type UpdateReminder = Tables["reminders"]["Update"];

export type SharedCycle = Tables["shared_cycles"]["Row"];
export type NewSharedCycle = Tables["shared_cycles"]["Insert"];
export type UpdateSharedCycle = Tables["shared_cycles"]["Update"];

// Custom types for the application
export type SymptomCategory = "Mood" | "Symptoms" | "Vaginal discharge";
export type ReminderType = "period" | "pill";
export type ReminderSchedule = "daily" | "weekly" | "monthly";

// Symptom type with additional UI properties
export interface SymptomWithUI extends SymptomType {
  isSelected?: boolean;
  color?: string;
}

// Period with expanded symptom information
export interface PeriodWithSymptoms extends Period {
  symptoms: SymptomWithUI[];
}