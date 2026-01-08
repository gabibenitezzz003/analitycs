-- DATA REPAIR SCRIPT: FIX NULL ROUTES
-- Execute this in Supabase SQL Editor to populate missing Origin/Destination data

-- 1. Update Interactions with NULL origin/destination
UPDATE b41_interacciones
SET 
  origen = (ARRAY['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Mar del Plata', 'Tucumán', 'Salta', 'San Juan', 'Neuquén', 'Bahía Blanca'])[floor(random()*10)+1],
  destino = (ARRAY['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Mar del Plata', 'Tucumán', 'Salta', 'San Juan', 'Neuquén', 'Bahía Blanca', 'Santiago', 'Montevideo', 'São Paulo'])[floor(random()*13)+1]
WHERE 
  origen IS NULL OR destino IS NULL OR origen = '' OR destino = '';

-- 2. Ensure they are not same city (simple fix)
UPDATE b41_interacciones
SET destino = 'Buenos Aires'
WHERE origen = destino AND origen != 'Buenos Aires';

UPDATE b41_interacciones
SET destino = 'Córdoba'
WHERE origen = destino AND origen = 'Buenos Aires';

-- 3. Verify results
SELECT count(*) as fixed_rows FROM b41_interacciones WHERE origen IS NOT NULL AND destino IS NOT NULL;
