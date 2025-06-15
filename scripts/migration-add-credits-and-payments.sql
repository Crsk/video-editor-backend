-- Create credit table for tracking all credit transactions
CREATE TABLE credit (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_credit_user_id ON credit(user_id);
CREATE INDEX idx_credit_created_at ON credit(created_at); 