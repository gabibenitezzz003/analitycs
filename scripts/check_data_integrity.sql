-- Check if we have transportistas and their phone numbers
SELECT telefono, nombre, apellido FROM b41_transportistas LIMIT 5;

-- Check interactions for one of those phones
SELECT telefono, origen, destino, created_at 
FROM b41_interacciones 
WHERE telefono IN (SELECT telefono FROM b41_transportistas LIMIT 5)
ORDER BY created_at DESC
LIMIT 20;

-- count valid routes
SELECT count(*) as total_rows, 
       count(origen) as with_origin, 
       count(destino) as with_dest 
FROM b41_interacciones;

-- Check distinct city names to compare with our dictionary
SELECT DISTINCT origen FROM b41_interacciones LIMIT 20;
