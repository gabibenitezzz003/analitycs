-- SCRIPT DE CORRECCIÓN + RELACIONES
-- Este script primero "cura" los datos huérfanos y luego aplica las relaciones.

-- ==============================================================================
-- 1. CURAR DATOS HUÉRFANOS (Backfill)
-- ==============================================================================

-- 1.1 Crear Sesiones faltantes
-- Si hay interacciones con un session_id que no existe en b41_sesiones, lo creamos
INSERT INTO public.b41_sesiones (session_id, created_at, inicio, telefono)
SELECT DISTINCT 
    i.session_id, 
    MIN(i.created_at), 
    MIN(i.created_at),
    MAX(i.telefono) -- Intentamos recuperar el teléfono de la interacción
FROM public.b41_interacciones i
LEFT JOIN public.b41_sesiones s ON i.session_id = s.session_id
WHERE s.session_id IS NULL AND i.session_id IS NOT NULL
GROUP BY i.session_id;

-- 1.2 Crear Transportistas faltantes (Opcional pero recomendado para evitar el siguiente error)
-- Si hay teléfonos en sesiones/interacciones que no están en b41_transportistas
INSERT INTO public.b41_transportistas (telefono, created_at)
SELECT DISTINCT telefono, NOW()
FROM public.b41_interacciones
WHERE telefono IS NOT NULL 
AND telefono NOT IN (SELECT telefono FROM public.b41_transportistas)
ON CONFLICT (telefono) DO NOTHING;


-- ==============================================================================
-- 2. APLICAR RELACIONES (Ahora sí no deberían fallar)
-- ==============================================================================

-- 2.1 Interacciones -> Sesiones
ALTER TABLE public.b41_interacciones
ADD CONSTRAINT fk_interacciones_sesiones
FOREIGN KEY (session_id)
REFERENCES public.b41_sesiones (session_id)
ON DELETE CASCADE; -- Ahora uso CASCADE para que limpiar sea más fácil en el futuro

-- 2.2 Funnel -> Sesiones
ALTER TABLE public.b41_funnel_eventos
ADD CONSTRAINT fk_funnel_sesiones
FOREIGN KEY (session_id)
REFERENCES public.b41_sesiones (session_id)
ON DELETE CASCADE;

-- 2.3 Sesiones -> Transportista
ALTER TABLE public.b41_sesiones
ADD CONSTRAINT fk_sesiones_transportista
FOREIGN KEY (telefono)
REFERENCES public.b41_transportistas (telefono)
ON UPDATE CASCADE
ON DELETE SET NULL;

-- 2.4 Interacciones -> Transportista
ALTER TABLE public.b41_interacciones
ADD CONSTRAINT fk_interacciones_transportista
FOREIGN KEY (telefono)
REFERENCES public.b41_transportistas (telefono)
ON UPDATE CASCADE
ON DELETE SET NULL;

-- 2.5 Ofertas -> Transportista
ALTER TABLE public.b41_ofertas
ADD CONSTRAINT fk_ofertas_transportista
FOREIGN KEY (telefono_destino)
REFERENCES public.b41_transportistas (telefono)
ON UPDATE CASCADE
ON DELETE SET NULL;
