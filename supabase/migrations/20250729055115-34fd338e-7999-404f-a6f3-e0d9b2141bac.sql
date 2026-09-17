-- Insert missing states counties data
INSERT INTO counties (county_name, state_name, state_code, fips_code) VALUES
-- Maryland
('Montgomery', 'Maryland', 'MD', '24031'),
('Prince Georges', 'Maryland', 'MD', '24033'),
('Baltimore', 'Maryland', 'MD', '24005'),
('Anne Arundel', 'Maryland', 'MD', '24003'),
('Howard', 'Maryland', 'MD', '24027'),
('Baltimore City', 'Maryland', 'MD', '24510'),
('Harford', 'Maryland', 'MD', '24025'),

-- Massachusetts  
('Middlesex', 'Massachusetts', 'MA', '25017'),
('Worcester', 'Massachusetts', 'MA', '25027'),
('Essex', 'Massachusetts', 'MA', '25009'),
('Suffolk', 'Massachusetts', 'MA', '25025'),
('Norfolk', 'Massachusetts', 'MA', '25021'),
('Bristol', 'Massachusetts', 'MA', '25005'),
('Plymouth', 'Massachusetts', 'MA', '25023'),

-- Minnesota
('Hennepin', 'Minnesota', 'MN', '27053'),
('Ramsey', 'Minnesota', 'MN', '27123'),
('Dakota', 'Minnesota', 'MN', '27037'),
('Anoka', 'Minnesota', 'MN', '27003'),
('Washington', 'Minnesota', 'MN', '27163'),
('Olmsted', 'Minnesota', 'MN', '27109'),
('Scott', 'Minnesota', 'MN', '27139'),

-- Missouri
('St. Louis', 'Missouri', 'MO', '29189'),
('Jackson', 'Missouri', 'MO', '29095'),
('St. Charles', 'Missouri', 'MO', '29183'),
('Jefferson', 'Missouri', 'MO', '29099'),
('Clay', 'Missouri', 'MO', '29047'),
('Greene', 'Missouri', 'MO', '29077'),
('Platte', 'Missouri', 'MO', '29165'),

-- New Jersey (already exists but adding more complete coverage)
('Camden', 'New Jersey', 'NJ', '34007'),
('Gloucester', 'New Jersey', 'NJ', '34015'),
('Morris', 'New Jersey', 'NJ', '34027'),
('Passaic', 'New Jersey', 'NJ', '34031'),
('Somerset', 'New Jersey', 'NJ', '34035'),
('Mercer', 'New Jersey', 'NJ', '34021'),

-- Virginia (already exists but adding more coverage)
('Richmond City', 'Virginia', 'VA', '51760'),
('Henrico', 'Virginia', 'VA', '51087'),
('Chesterfield', 'Virginia', 'VA', '51041'),

-- New Mexico
('Bernalillo', 'New Mexico', 'NM', '35001'),
('Dona Ana', 'New Mexico', 'NM', '35013'),
('Santa Fe', 'New Mexico', 'NM', '35049'),
('Sandoval', 'New Mexico', 'NM', '35043'),
('San Juan', 'New Mexico', 'NM', '35045'),
('Valencia', 'New Mexico', 'NM', '35061'),
('Chaves', 'New Mexico', 'NM', '35005')

ON CONFLICT (fips_code) DO NOTHING;