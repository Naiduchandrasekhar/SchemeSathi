CREATE TABLE IF NOT EXISTS government_schemes (
 id SERIAL PRIMARY KEY, scheme_name TEXT NOT NULL, category TEXT, state TEXT NOT NULL DEFAULT 'All India', min_age INT DEFAULT 0, max_age INT DEFAULT 120, gender TEXT DEFAULT 'Any', income_limit BIGINT, education TEXT DEFAULT 'Any', occupation TEXT DEFAULT 'Any', business_types TEXT[] DEFAULT '{}', benefits TEXT[] DEFAULT '{}', loan_amount TEXT, subsidy TEXT, required_documents TEXT[] DEFAULT '{}', application_process TEXT, official_link TEXT NOT NULL, last_updated TIMESTAMPTZ DEFAULT NOW()
);
