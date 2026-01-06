-- SCRIPT DE CORRECCIÓN DE MÉTRICAS (DEFINITIVO)
-- Agregamos TODAS las columnas faltantes, incluyendo timestamps.

ALTER TABLE public.b41_metricas_diarias
ADD COLUMN IF NOT EXISTS total_consultas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_mensajes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_conversaciones INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_usuarios INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_total NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Aseguramos permisos nuevamente
GRANT ALL ON public.b41_metricas_diarias TO authenticated;
GRANT ALL ON public.b41_metricas_diarias TO service_role;
