/*
  # Create news table for KIIT Student Forum

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `subtitle` (text)
      - `content` (text, required, max 250 words)
      - `image_url` (text, required)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `news` table
    - Add policies for:
      - Public read access
      - Authenticated users can create news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  content text NOT NULL CHECK (length(content) <= 1500), -- approximately 250 words
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "News is publicly viewable"
  ON news
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert news
CREATE POLICY "Authenticated users can create news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);