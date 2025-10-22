-- Update user role to staff
-- Replace 'bonded_last2k@icloud.com' with your actual email if different

-- First, check what branches exist in your database
SELECT id, name, restaurant_id FROM branches;

-- Update your user to staff role
UPDATE users
SET
  role = 'staff',
  branch_id = (SELECT id FROM branches LIMIT 1), -- Assigns to first branch
  restaurant_id = (SELECT restaurant_id FROM branches LIMIT 1) -- Gets restaurant from that branch
WHERE email = 'bonded_last2k@icloud.com';

-- Verify the update worked
SELECT id, email, role, branch_id, restaurant_id, full_name
FROM users
WHERE email = 'bonded_last2k@icloud.com';

-- Check that the branch and restaurant exist
SELECT
  u.email,
  u.role,
  b.name as branch_name,
  r.name as restaurant_name
FROM users u
LEFT JOIN branches b ON u.branch_id = b.id
LEFT JOIN restaurants r ON u.restaurant_id = r.id
WHERE u.email = 'bonded_last2k@icloud.com';
