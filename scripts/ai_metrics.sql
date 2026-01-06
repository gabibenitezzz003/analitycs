-- SCRIPT DE MÉTRICAS AVANZADAS DE IA
-- Objetivo: Preparar la DB para medir "Inteligencia" real (Confianza, Fricción, Razones de Fallo)

-- 1. Agregar columnas a la tabla de interacciones
ALTER TABLE public.b41_interacciones
ADD COLUMN IF NOT EXISTS confianza_ai NUMERIC(5,2) DEFAULT NULL, -- 0.00 a 1.00 (probabilidad)
ADD COLUMN IF NOT EXISTS es_repetitivo BOOLEAN DEFAULT FALSE,    -- Detectar bucles
ADD COLUMN IF NOT EXISTS motivo_fallback TEXT DEFAULT NULL,      -- "No entendí", "Timeout", "Sin Datos"
ADD COLUMN IF NOT EXISTS tokens_usados INTEGER DEFAULT 0;

-- 2. Crear Vista de Análisis de Fallos (Pareto de Errores)
CREATE OR REPLACE VIEW public.v_dashboard_fallbacks AS
SELECT 
    motivo_fallback,
    COUNT(*) as cantidad,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as porcentaje
FROM public.b41_interacciones
WHERE motivo_fallback IS NOT NULL
GROUP BY motivo_fallback
ORDER BY cantidad DESC
LIMIT 10;

-- 3. Función para detectar bucles automáticamente (Trigger)
-- Si el MISMO usuario manda el MISMO mensaje 2 veces seguidas en < 1 min, es fricción.
CREATE OR REPLACE FUNCTION public.detect_conversation_loop()
RETURNS trigger AS $$
DECLARE
    last_message TEXT;
    last_time TIMESTAMP;
BEGIN
    SELECT mensaje_usuario, created_at 
    INTO last_message, last_time
    FROM public.b41_interacciones
    WHERE session_id = NEW.session_id 
    ORDER BY created_at DESC 
    LIMIT 1 OFFSET 0; -- El anterior al actual? No, insert es BEFORE/AFTER. 
                      -- En Before Insert, la tabla aun no tiene el NEW.
                      
    IF last_message = NEW.mensaje_usuario AND (NEW.created_at - last_time) < interval '1 minute' THEN
        NEW.es_repetitivo := TRUE;
        -- Y castigamos la confianza
        NEW.confianza_ai := 0.1; 
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_loop_before_insert
BEFORE INSERT ON public.b41_interacciones
FOR EACH ROW
EXECUTE FUNCTION public.detect_conversation_loop();
