-- Seed data for drivers table
-- This file will be executed automatically on application startup
-- Note: If drivers already exist, they will be skipped due to ON CONFLICT

-- Insert 3 drivers with sample data

-- Driver 1: Ahmed Benali (Active, Online)
INSERT INTO drivers (
    name, email, password, phone, 
    vehicle_model, license_plate, vehicle_color,
    is_online, status,
    latitude, longitude,
    rating, total_rides, total_earnings,
    license_verified, insurance_verified,
    created_at, last_online_at
) VALUES (
    'Ahmed Benali',
    'ahmed@example.com',
    'password123',
    '+212612345678',
    'Dacia Logan',
    '1234-A-6',
    'White',
    true,
    'ACTIVE',
    34.0372,  -- Fes latitude
    -4.9998,  -- Fes longitude
    4.8,
    45,
    2250.50,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '6 months',
    CURRENT_TIMESTAMP - INTERVAL '30 minutes'
) ON CONFLICT (email) DO NOTHING;

-- Driver 2: Fatima Alami (Active, Offline)
INSERT INTO drivers (
    name, email, password, phone,
    vehicle_model, license_plate, vehicle_color,
    is_online, status,
    latitude, longitude,
    rating, total_rides, total_earnings,
    license_verified, insurance_verified,
    created_at, last_online_at
) VALUES (
    'Fatima Alami',
    'fatima@example.com',
    'password123',
    '+212612345679',
    'Renault Clio',
    '5678-B-12',
    'Blue',
    false,
    'INACTIVE',
    34.0372,
    -4.9998,
    4.9,
    78,
    3890.25,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 year',
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
) ON CONFLICT (email) DO NOTHING;

-- Driver 3: Youssef Idrissi (Active, Online)
INSERT INTO drivers (
    name, email, password, phone,
    vehicle_model, license_plate, vehicle_color,
    is_online, status,
    latitude, longitude,
    rating, total_rides, total_earnings,
    license_verified, insurance_verified,
    created_at, last_online_at
) VALUES (
    'Youssef Idrissi',
    'youssef@example.com',
    'password123',
    '+212612345680',
    'Peugeot 208',
    '9012-C-18',
    'Red',
    true,
    'ACTIVE',
    34.0372,
    -4.9998,
    4.7,
    32,
    1680.75,
    true,
    true,
    CURRENT_TIMESTAMP - INTERVAL '3 months',
    CURRENT_TIMESTAMP - INTERVAL '15 minutes'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample orders for today to calculate today's earnings
-- These orders are assigned to drivers and dated today
-- Note: Orders will be inserted only if they don't already exist

-- Orders for Driver 1 (Ahmed) - Today
-- Total: 150 + 85.50 + 120 + 95.75 = 451.25 MAD
-- Today's earnings (10% commission): 45.13 MAD
INSERT INTO orders (
    restaurant_id, driver_id, delivery_address, phone,
    total_amount, status, order_date, instructions, mode_paiement
) VALUES 
    (1, 1, '123 Boulevard Mohammed V, Fes', '+212612000001', 150.00, 'COMPLETED', CURRENT_DATE + TIME '08:30:00', '', 'CASH'),
    (1, 1, '456 Avenue Hassan II, Fes', '+212612000002', 85.50, 'COMPLETED', CURRENT_DATE + TIME '10:15:00', '', 'CARD'),
    (1, 1, '789 Rue Zerktouni, Fes', '+212612000003', 120.00, 'COMPLETED', CURRENT_DATE + TIME '12:45:00', '', 'CASH'),
    (1, 1, '321 Boulevard Anfa, Fes', '+212612000004', 95.75, 'COMPLETED', CURRENT_DATE + TIME '14:20:00', '', 'CARD')
ON CONFLICT DO NOTHING;

-- Orders for Driver 2 (Fatima) - Today
-- Total: 200 + 175.50 + 140.25 = 515.75 MAD
-- Today's earnings (10% commission): 51.58 MAD
INSERT INTO orders (
    restaurant_id, driver_id, delivery_address, phone,
    total_amount, status, order_date, instructions, mode_paiement
) VALUES 
    (1, 2, '111 Avenue des FAR, Fes', '+212612000005', 200.00, 'COMPLETED', CURRENT_DATE + TIME '09:00:00', '', 'CARD'),
    (1, 2, '222 Boulevard Zerktouni, Fes', '+212612000006', 175.50, 'COMPLETED', CURRENT_DATE + TIME '11:30:00', '', 'CASH'),
    (1, 2, '333 Rue Oued El Makhazine, Fes', '+212612000007', 140.25, 'COMPLETED', CURRENT_DATE + TIME '13:15:00', '', 'CARD')
ON CONFLICT DO NOTHING;

-- Orders for Driver 3 (Youssef) - Today
-- Total: 180 + 95 + 110.50 = 385.50 MAD
-- Today's earnings (10% commission): 38.55 MAD
INSERT INTO orders (
    restaurant_id, driver_id, delivery_address, phone,
    total_amount, status, order_date, instructions, mode_paiement
) VALUES 
    (1, 3, '444 Boulevard Moulay Youssef, Fes', '+212612000008', 180.00, 'COMPLETED', CURRENT_DATE + TIME '09:45:00', '', 'CASH'),
    (1, 3, '555 Avenue Lalla Yeddouna, Fes', '+212612000009', 95.00, 'COMPLETED', CURRENT_DATE + TIME '11:00:00', '', 'CARD'),
    (1, 3, '666 Rue Allal Ben Abdellah, Fes', '+212612000010', 110.50, 'COMPLETED', CURRENT_DATE + TIME '15:30:00', '', 'CASH')
ON CONFLICT DO NOTHING;

-- Insert a test PENDING order (without driver) for drivers to accept
-- This order will appear when drivers go online
-- Using a WHERE NOT EXISTS to avoid duplicates
INSERT INTO orders (
    restaurant_id, driver_id, delivery_address, phone,
    total_amount, status, order_date, instructions, mode_paiement
)
SELECT 1, NULL, 'Fes Medina, Fes', '+212612345678', 125.50, 'PENDING', CURRENT_TIMESTAMP, 'Please ring the doorbell', 'CASH'
WHERE NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE delivery_address = 'Fes Medina, Fes' 
    AND status = 'PENDING' 
    AND driver_id IS NULL
    LIMIT 1
);

-- Insert a test PENDING driver order (without driver) for drivers to accept
-- This order will appear when drivers go online in the driver dashboard
-- Using distinct locations: Train Station (Ville Nouvelle) and Medina (Old City)
INSERT INTO driver_orders (
    user_id, driver_id, pickup_address, delivery_address, phone,
    total_amount, status, order_date, instructions, mode_paiement
)
SELECT 1, NULL, 'Gare Fes-Ville, Avenue Mohammed V, Fes', 'Bab Boujloud, Fes Medina, Fes', '+212612345678', 125.50, 'PENDING', CURRENT_TIMESTAMP, 'Please ring the doorbell', 'CASH'
WHERE NOT EXISTS (
    SELECT 1 FROM driver_orders 
    WHERE delivery_address = 'Bab Boujloud, Fes Medina, Fes' 
    AND status = 'PENDING' 
    AND driver_id IS NULL
    LIMIT 1
);

