-- ============================================
-- DRIVER ORDERS TABLE SETUP FOR POSTGRESQL
-- Run these queries directly in PostgreSQL
-- ============================================

-- Step 1: Create the driver_orders table
CREATE TABLE IF NOT EXISTS driver_orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_address VARCHAR(255) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    instructions TEXT,
    mode_paiement VARCHAR(50),
    code_promo VARCHAR(50),
    total_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50),
    order_date TIMESTAMP
);

-- Step 2: Insert a test PENDING order (without driver)
-- This order will appear when drivers go online
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
SELECT 
    1,                              -- user_id
    NULL,                           -- driver_id (no driver assigned yet)
    'Casa Port Train Station, Casablanca',  -- pickup_address (where driver picks up user)
    'Morocco Mall, Casablanca',    -- delivery_address (where driver takes user)
    '+212612345678',               -- phone
    125.50,                         -- total_amount
    'PENDING',                      -- status
    CURRENT_TIMESTAMP,              -- order_date
    'Please ring the doorbell',     -- instructions
    'CASH'                          -- mode_paiement
WHERE NOT EXISTS (
    SELECT 1 FROM driver_orders 
    WHERE delivery_address = 'Morocco Mall, Casablanca' 
    AND status = 'PENDING' 
    AND driver_id IS NULL
    LIMIT 1
);

-- Step 3: Verify the data was inserted
SELECT * FROM driver_orders WHERE status = 'PENDING' AND driver_id IS NULL;

-- Step 4: If you want to see all driver orders
SELECT * FROM driver_orders ORDER BY order_date DESC;

-- Step 5: If you need to delete and recreate (optional - use with caution)
-- DELETE FROM driver_orders WHERE status = 'PENDING' AND driver_id IS NULL;
-- Then run the INSERT query again

