BEGIN;

TRUNCATE TABLE bookings, workers, services, users RESTART IDENTITY CASCADE;

INSERT INTO users (full_name, phone, email, role, status, city, created_at) VALUES
('Nimal Perera', '0771000001', 'nimal@example.com', 'customer', 'active', 'Colombo', NOW() - INTERVAL '130 days'),
('Kavindi Silva', '0771000002', 'kavindi@example.com', 'customer', 'active', 'Kandy', NOW() - INTERVAL '120 days'),
('Amal Fernando', '0771000003', 'amal@example.com', 'worker', 'active', 'Colombo', NOW() - INTERVAL '110 days'),
('Sajith Kumar', '0771000004', 'sajith@example.com', 'worker', 'active', 'Galle', NOW() - INTERVAL '100 days'),
('Tharushi Jayasinghe', '0771000005', 'tharushi@example.com', 'worker', 'active', 'Kandy', NOW() - INTERVAL '90 days'),
('Kasun Bandara', '0771000006', 'kasun@example.com', 'worker', 'active', 'Kurunegala', NOW() - INTERVAL '80 days'),
('Dilani Wickrama', '0771000007', 'dilani@example.com', 'customer', 'suspended', 'Gampaha', NOW() - INTERVAL '70 days'),
('Ruwan Senanayake', '0771000008', 'ruwan@example.com', 'customer', 'active', 'Colombo', NOW() - INTERVAL '60 days'),
('Mihiri Abeysekara', '0771000009', 'mihiri@example.com', 'customer', 'active', 'Matara', NOW() - INTERVAL '50 days'),
('Admin User', '0771000010', 'admin@itx.local', 'admin', 'active', 'Colombo', NOW() - INTERVAL '140 days');

INSERT INTO workers (user_id, service_name, verification_status, online_status, rating, completed_jobs, rejection_reason, verified_at) VALUES
(3, 'Electrician', 'approved', TRUE, 4.8, 42, NULL, NOW() - INTERVAL '95 days'),
(4, 'Plumber', 'pending', FALSE, 0, 0, NULL, NULL),
(5, 'Cleaner', 'approved', TRUE, 4.6, 28, NULL, NOW() - INTERVAL '70 days'),
(6, 'Laptop Repair', 'rejected', FALSE, 0, 0, 'NIC image was unclear', NOW() - INTERVAL '60 days');

INSERT INTO services (name, category, is_enabled, display_order) VALUES
('Electrical Repair', 'Home Services', TRUE, 1),
('Plumbing', 'Home Services', TRUE, 2),
('Home Cleaning', 'Home Services', TRUE, 3),
('Laptop Repair', 'Repair Services', TRUE, 4),
('Gardening', 'Outdoor Services', FALSE, 5),
('Car Wash', 'Vehicle Services', TRUE, 6);

INSERT INTO bookings (customer_id, worker_id, service_id, status, total_amount, city, scheduled_at, created_at) VALUES
(1, 1, 1, 'completed', 6500, 'Colombo', NOW() - INTERVAL '125 days', NOW() - INTERVAL '130 days'),
(2, 3, 3, 'completed', 4200, 'Kandy', NOW() - INTERVAL '95 days', NOW() - INTERVAL '100 days'),
(8, 1, 1, 'accepted', 3500, 'Colombo', NOW() + INTERVAL '2 days', NOW() - INTERVAL '5 days'),
(9, NULL, 5, 'pending', 2800, 'Matara', NOW() + INTERVAL '5 days', NOW() - INTERVAL '3 days'),
(1, 3, 3, 'in_progress', 5000, 'Colombo', NOW(), NOW() - INTERVAL '2 days'),
(2, 1, 1, 'cancelled', 2500, 'Kandy', NOW() - INTERVAL '15 days', NOW() - INTERVAL '20 days'),
(8, 3, 3, 'completed', 3900, 'Colombo', NOW() - INTERVAL '35 days', NOW() - INTERVAL '40 days'),
(9, 1, 1, 'completed', 7200, 'Matara', NOW() - INTERVAL '65 days', NOW() - INTERVAL '70 days');

COMMIT;
