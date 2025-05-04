-- First, delete existing users
DELETE FROM users;

-- Then insert test users
INSERT INTO users (name, email, test) VALUES 
  ('John Doe', 'john@example.com', 'test1'),
  ('Jane Smith', 'jane@example.com', 'test2'),
  ('Bob Johnson', 'bob@example.com', 'test3');
