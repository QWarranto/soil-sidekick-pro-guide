-- Add admin role to your user account
INSERT INTO user_roles (user_id, role)
VALUES ('e95930d5-21a2-43f6-b820-03c5ae467e8f', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;