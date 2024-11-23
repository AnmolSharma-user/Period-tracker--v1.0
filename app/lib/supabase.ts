import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { getPublicConfig } from './config';

const config = getPublicConfig();

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'period-tracker',
      },
    },
  }
);

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific Supabase error codes
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password';
    }
    
    if (message.includes('email already registered')) {
      return 'This email is already registered';
    }
    
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address';
    }
    
    if (message.includes('weak password')) {
      return 'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols';
    }
    
    if (message.includes('rate limit')) {
      return 'Too many attempts. Please try again later';
    }

    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Helper function to check if a user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

// Helper function to get the current user's profile
export async function getCurrentProfile() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.user) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;
    return profile;
  } catch (error) {
    console.error('Error getting current profile:', error);
    return null;
  }
}

// Helper function to format dates for Supabase
export function formatDateForSupabase(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper function to parse dates from Supabase
export function parseDateFromSupabase(dateString: string): Date {
  return new Date(dateString);
}

// Helper function to handle file uploads
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

// Helper function to get a public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Export types for use in other files
export type { Database };