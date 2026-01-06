-- SCRIPT CORREGIDO PARA RESETEAR DATOS
-- Usamos solo TRUNCATE con CASCADE, que es seguro y no requiere permisos de superusuario para triggers de sistema.

-- Borrar datos de todas las tablas en orden correcto (respetando dependencias gracias a CASCADE)
TRUNCATE TABLE public.b41_rutas_stats CASCADE;
TRUNCATE TABLE public.b41_metricas_diarias CASCADE;
TRUNCATE TABLE public.b41_funnel_eventos CASCADE;
TRUNCATE TABLE public.b41_ofertas CASCADE;
TRUNCATE TABLE public.b41_interacciones CASCADE;
TRUNCATE TABLE public.b41_sesiones CASCADE;
TRUNCATE TABLE public.b41_errores CASCADE;

-- (Opcional) Borrar transportistas de prueba
-- DELETE FROM public.b41_transportistas WHERE telefono LIKE '%test%';

-- Nota: Al usar CASCADE, borrar 'b41_sesiones' borrará automáticamente sus 'b41_interacciones' y 'b41_funnel_eventos' asociadas.
-- Pero ponerlas explícitamente asegura que todo quede limpio.
