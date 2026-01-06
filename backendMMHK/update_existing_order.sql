-- ============================================
-- UPDATE EXISTING ORDER WITH PICKUP ADDRESS
-- Run this query to add pickup_address to existing orders
-- ============================================

-- Update existing orders that don't have pickup_address
UPDATE driver_orders 
SET pickup_address = 'Fes Train Station, Fes'
WHERE pickup_address IS NULL OR pickup_address = '';

-- Verify the update
SELECT id, user_id, driver_id, pickup_address, delivery_address, status 
FROM driver_orders 
ORDER BY id DESC;

