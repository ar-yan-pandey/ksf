/*
  # Add sample news data

  1. Sample Data
    - Adds 3 initial news articles with realistic content
    - Uses placeholder user ID that will be replaced with actual user IDs
*/

INSERT INTO news (title, subtitle, content, image_url, user_id)
VALUES
  (
    'KIIT Ranks Among Top Engineering Colleges in India',
    'Achieves remarkable position in NIRF Rankings 2025',
    'KIIT University has achieved a significant milestone in the National Institutional Ranking Framework (NIRF) 2025. The institution has been recognized for its excellence in engineering education, research output, and industry collaboration. This achievement reflects the dedication of faculty, students, and staff in maintaining high academic standards.',
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Annual Tech Fest "KIIT FEST" Announced',
    'Three-day technology extravaganza coming this spring',
    'The much-awaited KIIT FEST is set to return this spring with an exciting lineup of events. Students can participate in coding competitions, robotics challenges, and innovative project showcases. The festival will also feature keynote speeches from industry leaders and workshops on emerging technologies.',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'KIIT Opens New Innovation Lab',
    'State-of-the-art facility to boost research and development',
    'KIIT University has inaugurated a new Innovation Lab equipped with cutting-edge technology. The facility includes 3D printers, AR/VR equipment, and advanced computing resources. This initiative aims to promote research, innovation, and entrepreneurship among students.',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=1000',
    '00000000-0000-0000-0000-000000000000'
  );