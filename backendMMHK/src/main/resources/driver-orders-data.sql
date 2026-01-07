-- Seed data for driver_orders table
-- This file creates test orders for drivers

-- Insert a test PENDING order (without driver) for drivers to accept
-- This order will appear when drivers go online
INSERT INTO driver_orders (
    user_id, driver_id, delivery_address, phone,
    total_amount, status, order_date, instructions, mode_paiement
)
SELECT 1, NULL, 'Morocco Mall, Casablanca', '+212612345678', 125.50, 'PENDING', CURRENT_TIMESTAMP, 'Please ring the doorbell', 'CASH'
WHERE NOT EXISTS (
    SELECT 1 FROM driver_orders 
    WHERE delivery_address = 'Morocco Mall, Casablanca' 
    AND status = 'PENDING' 
    AND driver_id IS NULL
    LIMIT 1
);

