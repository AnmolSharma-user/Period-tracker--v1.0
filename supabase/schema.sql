-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cycle_length INTEGER NOT NULL DEFAULT 28,
    last_period_date DATE NOT NULL,
    has_period_reminders BOOLEAN DEFAULT TRUE NOT NULL,
    has_pill_reminders BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT cycle_length_check CHECK (cycle_length BETWEEN 21 AND 35),
    UNIQUE (user_id)
);

-- Create periods table
CREATE TABLE IF NOT EXISTS periods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    symptoms JSONB[] DEFAULT ARRAY[]::JSONB[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT end_date_after_start_date CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Create symptom_types table (renamed from symptoms for clarity)
CREATE TABLE IF NOT EXISTS symptom_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symptom_name TEXT NOT NULL,
    symptom_category TEXT NOT NULL,
    symptom_icon TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (symptom_name, symptom_category)
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('period', 'pill')),
    schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
    time TIME NOT NULL,
    message TEXT,
    enabled BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create shared_cycles table
CREATE TABLE IF NOT EXISTS shared_cycles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    shared_with_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    share_code TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT no_self_sharing CHECK (user_id != shared_with_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS periods_user_id_idx ON periods(user_id);
CREATE INDEX IF NOT EXISTS periods_start_date_idx ON periods(start_date);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);
CREATE INDEX IF NOT EXISTS shared_cycles_user_id_idx ON shared_cycles(user_id);
CREATE INDEX IF NOT EXISTS shared_cycles_shared_with_id_idx ON shared_cycles(shared_with_id);
CREATE INDEX IF NOT EXISTS shared_cycles_share_code_idx ON shared_cycles(share_code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_user_preferences
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_periods
    BEFORE UPDATE ON periods
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_symptom_types
    BEFORE UPDATE ON symptom_types
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_reminders
    BEFORE UPDATE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at_shared_cycles
    BEFORE UPDATE ON shared_cycles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_cycles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Periods policies
CREATE POLICY "Users can view their own periods"
    ON periods FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own periods"
    ON periods FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own periods"
    ON periods FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own periods"
    ON periods FOR DELETE
    USING (auth.uid() = user_id);

-- Symptom types policies
CREATE POLICY "Anyone can view symptom types"
    ON symptom_types FOR SELECT
    TO authenticated
    USING (true);

-- Reminders policies
CREATE POLICY "Users can view their own reminders"
    ON reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
    ON reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
    ON reminders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
    ON reminders FOR DELETE
    USING (auth.uid() = user_id);

-- Shared cycles policies
CREATE POLICY "Users can view their shared cycles"
    ON shared_cycles FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = shared_with_id);

CREATE POLICY "Users can insert their shared cycles"
    ON shared_cycles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their shared cycles"
    ON shared_cycles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their shared cycles"
    ON shared_cycles FOR DELETE
    USING (auth.uid() = user_id);

-- Insert default symptom types
INSERT INTO symptom_types (symptom_name, symptom_category, symptom_icon) VALUES
    ('Calm', 'Mood', '😌'),
    ('Mood swings', 'Mood', '🎭'),
    ('Happy', 'Mood', '😊'),
    ('Energetic', 'Mood', '⚡'),
    ('Everything is fine', 'Symptoms', '👍'),
    ('Cramps', 'Symptoms', '🌊'),
    ('Tender breasts', 'Symptoms', '💗'),
    ('Fatigue', 'Symptoms', '🔋'),
    ('Acne', 'Symptoms', '🔴'),
    ('Backache', 'Symptoms', '🔙'),
    ('Headache', 'Symptoms', '🤕'),
    ('Craving', 'Symptoms', '🍫'),
    ('No discharge', 'Vaginal discharge', '❌'),
    ('Eggwhite', 'Vaginal discharge', '💧'),
    ('Spotting', 'Vaginal discharge', '🔴'),
    ('Sticky', 'Vaginal discharge', '💫')
ON CONFLICT (symptom_name, symptom_category) DO NOTHING;