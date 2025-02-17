/*
  # Add sample news data with test user

  1. Create Test User
    - Creates a test user account in auth.users
    - Uses this user for sample news articles
  
  2. Sample Data
    - Adds 3 initial news articles with realistic content
    - Links articles to the test user
*/

-- First, create a test user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  'db8b5f60-0000-4000-a000-000000000000',
  'test@kiit.ac.in',
  '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12',
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE
) ON CONFLICT (id) DO NOTHING;

-- Then insert the news items using the test user's ID
INSERT INTO news (title, subtitle, content, image_url, user_id)
VALUES
  (
    'KIIT Ranks Among Top Engineering Colleges in India',
    'Achieves remarkable position in NIRF Rankings 2025',
    'KIIT University has achieved a significant milestone in the National Institutional Ranking Framework (NIRF) 2025. The institution has been recognized for its excellence in engineering education, research output, and industry collaboration. This achievement reflects the dedication of faculty, students, and staff in maintaining high academic standards.',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000',
    'db8b5f60-0000-4000-a000-000000000000'
  ),
  (
    'Annual Tech Fest "KIIT FEST" Announced',
    'Three-day technology extravaganza coming this spring',
    'The much-awaited KIIT FEST is set to return this spring with an exciting lineup of events. Students can participate in coding competitions, robotics challenges, and innovative project showcases. The festival will also feature keynote speeches from industry leaders and workshops on emerging technologies.',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000',
    'db8b5f60-0000-4000-a000-000000000000'
  ),
  (
    'KIIT Opens New Innovation Lab',
    'State-of-the-art facility to boost research and development',
    'KIIT University has inaugurated a new Innovation Lab equipped with cutting-edge technology. The facility includes 3D printers, AR/VR equipment, and advanced computing resources. This initiative aims to promote research, innovation, and entrepreneurship among students.',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=1000',
    'db8b5f60-0000-4000-a000-000000000000'
  );