-- DepthForge Supabase Schema

-- Admins table — these accounts bypass all credit checks
CREATE TABLE IF NOT EXISTS admins (
    email TEXT PRIMARY KEY,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);

INSERT INTO admins (email, note) VALUES
    ('mgarc350@gmail.com',          'Owner'),
    ('garciamervin33@gmail.com',     'Owner'),
    ('compatoonsofficial@gmail.com', 'Owner')
ON CONFLICT (email) DO NOTHING;

-- Credits table
CREATE TABLE IF NOT EXISTS credits (
    user_id TEXT PRIMARY KEY,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'done', 'error')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    message TEXT DEFAULT '',
    model_url TEXT,
    thumbnail_url TEXT,
    credits_used INTEGER NOT NULL DEFAULT 0,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs (user_id);
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON jobs (created_at DESC);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    credits_added INTEGER NOT NULL,
    amount_cents INTEGER,
    stripe_session_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions (user_id);

-- Function to add credits (upsert)
CREATE OR REPLACE FUNCTION add_credits(p_user_id TEXT, p_credits INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO credits (user_id, balance, updated_at)
    VALUES (p_user_id, p_credits, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
        balance = credits.balance + p_credits,
        updated_at = NOW();
END;
$$;

-- Function to deduct credits (returns true if successful)
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id TEXT, p_amount INTEGER)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_current INTEGER;
BEGIN
    SELECT balance INTO v_current FROM credits WHERE user_id = p_user_id FOR UPDATE;

    IF v_current IS NULL OR v_current < p_amount THEN
        RETURN FALSE;
    END IF;

    UPDATE credits
    SET balance = balance - p_amount, updated_at = NOW()
    WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$;

-- Row Level Security
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies (users can only see their own data)
CREATE POLICY "Users can view own credits" ON credits
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view own jobs" ON jobs
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (user_id = auth.uid()::text);

-- Storage bucket (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('models', 'models', true);
