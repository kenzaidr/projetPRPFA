-- ============================================
-- CHECK AND CREATE DRIVER ORDER
-- Run these queries in PostgreSQL to verify and create test order
-- ============================================

-- Step 1: Check if table exists and see its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'driver_orders'
ORDER BY ordinal_position;

-- Step 2: Check if there are any orders at all
SELECT COUNT(*) as total_orders FROM driver_orders;

-- Step 3: Check pending orders without driver
SELECT * FROM driver_orders 
WHERE status = 'PENDING' AND driver_id IS NULL;

-- Step 4: Check all orders
SELECT id, user_id, driver_id, pickup_address, delivery_address, status, order_date 
FROM driver_orders 
ORDER BY order_date DESC;

-- Step 5: Delete any existing test orders (optional - to start fresh)
DELETE FROM driver_orders 
    WHERE delivery_address = 'Fes Medina, Fes'
AND status = 'PENDING';

-- Step 6: Insert a new test order
INSERT INTO driver_orders (
    user_id, 
    driver_id, 
    pickup_address, 
    delivery_address, 
    phone,
    total_amount, 
    status, 
    order_date, 
    instructions, 
    mode_paiement
)
VALUES (
    1,                              -- user_id
    NULL,                           -- driver_id (no driver assigned yet)
    'Fes Train Station, Fes',  -- pickup_address
    'Fes Medina, Fes',    -- delivery_address
    '+212612345678',               -- phone
    125.50,                         -- total_amount
    'PENDING',                      -- status
    CURRENT_TIMESTAMP,              -- order_date
    'Please ring the doorbell',     -- instructions
    'CASH'                          -- mode_paiement
);

-- Step 7: Verify the order was created
SELECT * FROM driver_orders 
WHERE status = 'PENDING' AND driver_id IS NULL;

