-- Temporarily drop foreign key constraints if any exist to allow bulk insert
-- Insert comprehensive county data for major agricultural and populated regions

INSERT INTO counties (county_name, state_name, state_code, fips_code) VALUES
-- Agricultural powerhouse states
-- Iowa (Major agricultural state)
('Polk', 'Iowa', 'IA', '19153'),
('Linn', 'Iowa', 'IA', '19113'),
('Scott', 'Iowa', 'IA', '19163'),
('Johnson', 'Iowa', 'IA', '19103'),
('Black Hawk', 'Iowa', 'IA', '19013'),
('Woodbury', 'Iowa', 'IA', '19193'),
('Dubuque', 'Iowa', 'IA', '19061'),
('Story', 'Iowa', 'IA', '19169'),
('Marshall', 'Iowa', 'IA', '19127'),
('Clinton', 'Iowa', 'IA', '19045'),

-- Nebraska (Major agricultural)
('Douglas', 'Nebraska', 'NE', '31055'),
('Lancaster', 'Nebraska', 'NE', '31109'),
('Sarpy', 'Nebraska', 'NE', '31153'),
('Hall', 'Nebraska', 'NE', '31079'),
('Buffalo', 'Nebraska', 'NE', '31019'),
('Madison', 'Nebraska', 'NE', '31119'),
('Dodge', 'Nebraska', 'NE', '31053'),
('Platte', 'Nebraska', 'NE', '31141'),

-- Kansas (Major agricultural)
('Johnson', 'Kansas', 'KS', '20091'),
('Sedgwick', 'Kansas', 'KS', '20173'),
('Shawnee', 'Kansas', 'KS', '20177'),
('Wyandotte', 'Kansas', 'KS', '20209'),
('Riley', 'Kansas', 'KS', '20161'),
('Saline', 'Kansas', 'KS', '20169'),
('Butler', 'Kansas', 'KS', '20015'),
('Reno', 'Kansas', 'KS', '20155'),

-- Illinois (expand existing)
('Champaign', 'Illinois', 'IL', '17019'),
('Peoria', 'Illinois', 'IL', '17143'),
('Sangamon', 'Illinois', 'IL', '17167'),
('Winnebago', 'Illinois', 'IL', '17201'),
('Rock Island', 'Illinois', 'IL', '17161'),
('Macon', 'Illinois', 'IL', '17115'),
('McLean', 'Illinois', 'IL', '17113'),

-- Indiana (expand existing)
('Johnson', 'Indiana', 'IN', '18081'),
('Delaware', 'Indiana', 'IN', '18035'),
('Monroe', 'Indiana', 'IN', '18105'),
('Porter', 'Indiana', 'IN', '18127'),
('Tippecanoe', 'Indiana', 'IN', '18157'),
('Madison', 'Indiana', 'IN', '18095'),

-- Ohio (expand existing)
('Delaware', 'Ohio', 'OH', '39041'),
('Lorain', 'Ohio', 'OH', '39093'),
('Stark', 'Ohio', 'OH', '39151'),
('Mahoning', 'Ohio', 'OH', '39099'),
('Trumbull', 'Ohio', 'OH', '39155'),
('Warren', 'Ohio', 'OH', '39165'),
('Lake', 'Ohio', 'OH', '39085'),

-- Michigan (expand existing)
('Ottawa', 'Michigan', 'MI', '26139'),
('Kalamazoo', 'Michigan', 'MI', '26077'),
('Saginaw', 'Michigan', 'MI', '26145'),
('Muskegon', 'Michigan', 'MI', '26121'),
('Jackson', 'Michigan', 'MI', '26075'),
('Berrien', 'Michigan', 'MI', '26021'),

-- Wisconsin (expand existing)
('Rock', 'Wisconsin', 'WI', '55105'),
('Kenosha', 'Wisconsin', 'WI', '55059'),
('La Crosse', 'Wisconsin', 'WI', '55063'),
('Eau Claire', 'Wisconsin', 'WI', '55035'),
('Marathon', 'Wisconsin', 'WI', '55073'),
('Washington', 'Wisconsin', 'WI', '55131'),

-- More Pennsylvania counties
('Westmoreland', 'Pennsylvania', 'PA', '42129'),
('Luzerne', 'Pennsylvania', 'PA', '42079'),
('Berks', 'Pennsylvania', 'PA', '42011'),
('Northampton', 'Pennsylvania', 'PA', '42095'),
('Lehigh', 'Pennsylvania', 'PA', '42077'),
('Dauphin', 'Pennsylvania', 'PA', '42043'),

-- More New York counties
('Albany', 'New York', 'NY', '36001'),
('Onondaga', 'New York', 'NY', '36067'),
('Oneida', 'New York', 'NY', '36065'),
('Niagara', 'New York', 'NY', '36063'),
('Dutchess', 'New York', 'NY', '36027'),
('Orange', 'New York', 'NY', '36071'),
('Rockland', 'New York', 'NY', '36087'),

-- Georgia (expand existing)
('Houston', 'Georgia', 'GA', '13153'),
('Muscogee', 'Georgia', 'GA', '13215'),
('Richmond', 'Georgia', 'GA', '13245'),
('Chatham', 'Georgia', 'GA', '13051'),
('Bibb', 'Georgia', 'GA', '13021'),
('Dougherty', 'Georgia', 'GA', '13095'),
('Lowndes', 'Georgia', 'GA', '13185'),

-- North Carolina (expand existing)
('Gaston', 'North Carolina', 'NC', '37071'),
('Cabarrus', 'North Carolina', 'NC', '37025'),
('Iredell', 'North Carolina', 'NC', '37097'),
('Catawba', 'North Carolina', 'NC', '37035'),
('Rowan', 'North Carolina', 'NC', '37159'),
('Johnston', 'North Carolina', 'NC', '37101'),
('New Hanover', 'North Carolina', 'NC', '37129'),

-- South Carolina (expand existing)
('York', 'South Carolina', 'SC', '45091'),
('Horry', 'South Carolina', 'SC', '45051'),
('Berkeley', 'South Carolina', 'SC', '45015'),
('Anderson', 'South Carolina', 'SC', '45007'),
('Aiken', 'South Carolina', 'SC', '45003'),
('Beaufort', 'South Carolina', 'SC', '45013'),

-- Tennessee (expand existing)
('Blount', 'Tennessee', 'TN', '47009'),
('Sullivan', 'Tennessee', 'TN', '47163'),
('Washington', 'Tennessee', 'TN', '47179'),
('Madison', 'Tennessee', 'TN', '47113'),
('Bradley', 'Tennessee', 'TN', '47011'),
('Wilson', 'Tennessee', 'TN', '47189'),
('Sumner', 'Tennessee', 'TN', '47165'),

-- Kentucky
('Jefferson', 'Kentucky', 'KY', '21111'),
('Fayette', 'Kentucky', 'KY', '21067'),
('Kenton', 'Kentucky', 'KY', '21117'),
('Boone', 'Kentucky', 'KY', '21015'),
('Warren', 'Kentucky', 'KY', '21227'),
('Campbell', 'Kentucky', 'KY', '21037'),
('Daviess', 'Kentucky', 'KY', '21059'),
('Hardin', 'Kentucky', 'KY', '21093'),

-- Alabama (expand existing)
('Lee', 'Alabama', 'AL', '01081'),
('Etowah', 'Alabama', 'AL', '01055'),
('Houston', 'Alabama', 'AL', '01069'),
('Calhoun', 'Alabama', 'AL', '01015'),
('Morgan', 'Alabama', 'AL', '01103'),
('Lauderdale', 'Alabama', 'AL', '01077'),

-- Mississippi
('Hinds', 'Mississippi', 'MS', '28049'),
('Harrison', 'Mississippi', 'MS', '28047'),
('DeSoto', 'Mississippi', 'MS', '28033'),
('Jackson', 'Mississippi', 'MS', '28059'),
('Rankin', 'Mississippi', 'MS', '28121'),
('Lee', 'Mississippi', 'MS', '28081'),
('Forrest', 'Mississippi', 'MS', '28035'),

-- Louisiana
('East Baton Rouge', 'Louisiana', 'LA', '22033'),
('Jefferson', 'Louisiana', 'LA', '22051'),
('Orleans', 'Louisiana', 'LA', '22071'),
('Caddo', 'Louisiana', 'LA', '22017'),
('Lafayette', 'Louisiana', 'LA', '22055'),
('Calcasieu', 'Louisiana', 'LA', '22019'),
('Ouachita', 'Louisiana', 'LA', '22073'),
('St. Tammany', 'Louisiana', 'LA', '22103'),

-- Arkansas
('Pulaski', 'Arkansas', 'AR', '05119'),
('Washington', 'Arkansas', 'AR', '05143'),
('Benton', 'Arkansas', 'AR', '05007'),
('Sebastian', 'Arkansas', 'AR', '05131'),
('Faulkner', 'Arkansas', 'AR', '05045'),
('Craighead', 'Arkansas', 'AR', '05031'),
('Saline', 'Arkansas', 'AR', '05125'),

-- Oklahoma
('Oklahoma', 'Oklahoma', 'OK', '40109'),
('Tulsa', 'Oklahoma', 'OK', '40143'),
('Cleveland', 'Oklahoma', 'OK', '40027'),
('Comanche', 'Oklahoma', 'OK', '40031'),
('Canadian', 'Oklahoma', 'OK', '40017'),
('Creek', 'Oklahoma', 'OK', '40037'),
('Payne', 'Oklahoma', 'OK', '40119'),

-- More Texas counties (major agricultural)
('Williamson', 'Texas', 'TX', '48491'),
('Denton', 'Texas', 'TX', '48121'),
('Galveston', 'Texas', 'TX', '48167'),
('Brazoria', 'Texas', 'TX', '48039'),
('Bell', 'Texas', 'TX', '48027'),
('McLennan', 'Texas', 'TX', '48309'),
('Nueces', 'Texas', 'TX', '48355'),
('Jefferson', 'Texas', 'TX', '48245'),
('Ellis', 'Texas', 'TX', '48139'),
('Guadalupe', 'Texas', 'TX', '48187'),

-- More California counties (agricultural)
('San Joaquin', 'California', 'CA', '06077'),
('Stanislaus', 'California', 'CA', '06099'),
('Merced', 'California', 'CA', '06047'),
('Tulare', 'California', 'CA', '06107'),
('Imperial', 'California', 'CA', '06025'),
('Monterey', 'California', 'CA', '06053'),
('San Luis Obispo', 'California', 'CA', '06079'),
('Solano', 'California', 'CA', '06095'),
('Yolo', 'California', 'CA', '06113'),
('Napa', 'California', 'CA', '06055'),

-- More Washington counties
('Yakima', 'Washington', 'WA', '53077'),
('Whatcom', 'Washington', 'WA', '53073'),
('Skagit', 'Washington', 'WA', '53057'),
('Cowlitz', 'Washington', 'WA', '53015'),
('Grant', 'Washington', 'WA', '53025'),
('Benton', 'Washington', 'WA', '53005'),
('Franklin', 'Washington', 'WA', '53021'),

-- Oregon
('Multnomah', 'Oregon', 'OR', '41051'),
('Washington', 'Oregon', 'OR', '41067'),
('Clackamas', 'Oregon', 'OR', '41005'),
('Marion', 'Oregon', 'OR', '41047'),
('Lane', 'Oregon', 'OR', '41039'),
('Jackson', 'Oregon', 'OR', '41029'),
('Deschutes', 'Oregon', 'OR', '41017'),
('Polk', 'Oregon', 'OR', '41053'),

-- More Colorado counties
('Douglas', 'Colorado', 'CO', '08035'),
('Weld', 'Colorado', 'CO', '08123'),
('Pueblo', 'Colorado', 'CO', '08101'),
('Mesa', 'Colorado', 'CO', '08077'),
('Garfield', 'Colorado', 'CO', '08045'),
('La Plata', 'Colorado', 'CO', '08067'),

-- Utah
('Salt Lake', 'Utah', 'UT', '49035'),
('Utah', 'Utah', 'UT', '49049'),
('Davis', 'Utah', 'UT', '49011'),
('Weber', 'Utah', 'UT', '49057'),
('Washington', 'Utah', 'UT', '49053'),
('Cache', 'Utah', 'UT', '49005'),

-- Nevada (expand existing)
('Washoe', 'Nevada', 'NV', '32031'),
('Douglas', 'Nevada', 'NV', '32005'),
('Lyon', 'Nevada', 'NV', '32019'),

-- Idaho
('Ada', 'Idaho', 'ID', '16001'),
('Canyon', 'Idaho', 'ID', '16027'),
('Kootenai', 'Idaho', 'ID', '16055'),
('Bonneville', 'Idaho', 'ID', '16019'),
('Madison', 'Idaho', 'ID', '16065'),
('Twin Falls', 'Idaho', 'ID', '16083'),

-- Montana
('Yellowstone', 'Montana', 'MT', '30111'),
('Missoula', 'Montana', 'MT', '30063'),
('Gallatin', 'Montana', 'MT', '30031'),
('Flathead', 'Montana', 'MT', '30029'),
('Cascade', 'Montana', 'MT', '30013'),
('Lewis and Clark', 'Montana', 'MT', '30049'),

-- Wyoming
('Laramie', 'Wyoming', 'WY', '56021'),
('Natrona', 'Wyoming', 'WY', '56025'),
('Campbell', 'Wyoming', 'WY', '56005'),
('Fremont', 'Wyoming', 'WY', '56013'),
('Sweetwater', 'Wyoming', 'WY', '56037'),

-- North Dakota
('Cass', 'North Dakota', 'ND', '38017'),
('Burleigh', 'North Dakota', 'ND', '38015'),
('Grand Forks', 'North Dakota', 'ND', '38035'),
('Ward', 'North Dakota', 'ND', '38101'),
('Williams', 'North Dakota', 'ND', '38105'),

-- South Dakota
('Minnehaha', 'South Dakota', 'SD', '46099'),
('Pennington', 'South Dakota', 'SD', '46103'),
('Lincoln', 'South Dakota', 'SD', '46083'),
('Brown', 'South Dakota', 'SD', '46013'),
('Brookings', 'South Dakota', 'SD', '46011'),

-- Vermont
('Chittenden', 'Vermont', 'VT', '50007'),
('Rutland', 'Vermont', 'VT', '50021'),
('Washington', 'Vermont', 'VT', '50023'),
('Windsor', 'Vermont', 'VT', '50027'),
('Franklin', 'Vermont', 'VT', '50011'),

-- New Hampshire
('Hillsborough', 'New Hampshire', 'NH', '33011'),
('Rockingham', 'New Hampshire', 'NH', '33015'),
('Merrimack', 'New Hampshire', 'NH', '33013'),
('Strafford', 'New Hampshire', 'NH', '33017'),
('Grafton', 'New Hampshire', 'NH', '33009'),

-- Maine
('Cumberland', 'Maine', 'ME', '23005'),
('York', 'Maine', 'ME', '23031'),
('Penobscot', 'Maine', 'ME', '23019'),
('Kennebec', 'Maine', 'ME', '23011'),
('Androscoggin', 'Maine', 'ME', '23001'),

-- Connecticut
('Fairfield', 'Connecticut', 'CT', '09001'),
('Hartford', 'Connecticut', 'CT', '09003'),
('New Haven', 'Connecticut', 'CT', '09009'),
('Litchfield', 'Connecticut', 'CT', '09005'),
('New London', 'Connecticut', 'CT', '09011'),

-- Rhode Island
('Providence', 'Rhode Island', 'RI', '44007'),
('Kent', 'Rhode Island', 'RI', '44003'),
('Washington', 'Rhode Island', 'RI', '44009'),
('Newport', 'Rhode Island', 'RI', '44005'),
('Bristol', 'Rhode Island', 'RI', '44001'),

-- Delaware
('New Castle', 'Delaware', 'DE', '10003'),
('Sussex', 'Delaware', 'DE', '10005'),
('Kent', 'Delaware', 'DE', '10001'),

-- West Virginia
('Kanawha', 'West Virginia', 'WV', '54039'),
('Monongalia', 'West Virginia', 'WV', '54061'),
('Cabell', 'West Virginia', 'WV', '54011'),
('Wood', 'West Virginia', 'WV', '54107'),
('Jefferson', 'West Virginia', 'WV', '54037'),
('Raleigh', 'West Virginia', 'WV', '54081'),

-- Alaska
('Anchorage', 'Alaska', 'AK', '02020'),
('Fairbanks North Star', 'Alaska', 'AK', '02090'),
('Matanuska-Susitna', 'Alaska', 'AK', '02170'),
('Kenai Peninsula', 'Alaska', 'AK', '02122'),
('Juneau', 'Alaska', 'AK', '02110'),

-- Hawaii
('Honolulu', 'Hawaii', 'HI', '15003'),
('Hawaii', 'Hawaii', 'HI', '15001'),
('Maui', 'Hawaii', 'HI', '15009'),
('Kauai', 'Hawaii', 'HI', '15007')

ON CONFLICT (fips_code) DO NOTHING;