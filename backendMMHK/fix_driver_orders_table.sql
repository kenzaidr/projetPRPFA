-- ============================================
-- FIX DRIVER_ORDERS TABLE - ADD MISSING COLUMN
-- Run these queries in PostgreSQL
-- ============================================

-- Step 1: Add the pickup_address column to existing table
ALTER TABLE driver_orders 
ADD COLUMN IF NOT EXISTS pickup_address VARCHAR(255);

-- Step 2: Set pickup_address as NOT NULL (after adding data)
-- First, update any existing NULL values
UPDATE driver_orders 
SET pickup_address = 'Fes Train Station, Fes' 
WHERE pickup_address IS NULL OR pickup_address = '';

-- Step 3: Now you can insert the test order
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
    'Fes Train Station, Fes',  -- pickup_address
    'Fes Medina, Fes',    -- delivery_address
    '+212612345678',               -- phone
    125.50,                         -- total_amount
    'PENDING',                      -- status
    CURRENT_TIMESTAMP,              -- order_date
    'Please ring the doorbell',     -- instructions
    'CASH'                          -- mode_paiement
WHERE NOT EXISTS (
    SELECT 1 FROM driver_orders 
    WHERE delivery_address = 'Fes Medina, Fes' 
    AND status = 'PENDING' 
    AND driver_id IS NULL
    LIMIT 1
);

-- Step 4: Verify the data
SELECT * FROM driver_orders WHERE status = 'PENDING' AND driver_id IS NULL;

