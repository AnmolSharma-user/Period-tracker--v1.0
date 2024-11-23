# Supabase Setup Instructions

## Step 1: Execute Schema in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: https://gdslhzsvkbwjcbtbjhas.supabase.co
3. Navigate to the SQL Editor (left sidebar)
4. Create a new query
5. Copy the entire contents of `schema.sql` into the SQL Editor
6. Click "Run" to execute the SQL commands

## Database Schema Overview

### Tables

1. `profiles`
   - Extends Supabase auth.users
   - Stores user preferences and cycle information
   - Fields: id, email, full_name, avatar_url, cycle_length, period_length

2. `periods`
   - Tracks menstrual cycles
   - Fields: id, user_id, start_date, end_date, flow_intensity, notes

3. `symptoms`
   - Records symptoms and moods
   - Categories: mood, physical, other
   - Fields: id, period_id, user_id, date, category, symptom_type, intensity, notes

4. `reminders`
   - Manages user reminders
   - Types: period, medication, appointment
   - Fields: id, user_id, type, title, description, reminder_date, is_recurring, recurrence_pattern

### Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic profile creation on signup
- Secure update/delete policies

### Performance Optimizations

- Indexes on frequently queried columns
- Automatic timestamp updates
- Efficient foreign key relationships

## Troubleshooting

If you encounter any errors while executing the schema:

1. **Existing Tables**: If tables already exist, you may need to drop them first:
   ```sql
   DROP TABLE IF EXISTS public.reminders;
   DROP TABLE IF EXISTS public.symptoms;
   DROP TABLE IF EXISTS public.periods;
   DROP TABLE IF EXISTS public.profiles;
   ```

2. **UUID Extension**: If the UUID extension error occurs:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

3. **RLS Policies**: If policy errors occur, ensure you're logged in as the project owner

## Environment Variables

Make sure these environment variables are set in your .env file:

```env
SUPABASE_URL=https://gdslhzsvkbwjcbtbjhas.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2xoenN2a2J3amNidGJqaGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTA2MzgsImV4cCI6MjA0NzkyNjYzOH0.j-j6HAyoMq2Js268wt7Zf1z2ZwkghBKJsYJ5mT9bChk
```

## Verification Steps

After executing the schema:

1. Check Tables:
   - Go to Table Editor
   - Verify all tables are created
   - Check indexes and relationships

2. Test RLS Policies:
   - Create a test user
   - Verify profile creation trigger
   - Test data access restrictions

3. Verify Triggers:
   - Insert test data
   - Check updated_at timestamps
   - Verify cascade deletes

## Next Steps

1. Execute the schema in Supabase
2. Verify all tables and policies are created
3. Test the authentication flow
4. Begin implementing the frontend features

## Support

If you encounter any issues:
1. Check the Supabase logs in the Dashboard
2. Verify RLS policies are correctly applied
3. Ensure all extensions are enabled
4. Check foreign key relationships

For additional help, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)