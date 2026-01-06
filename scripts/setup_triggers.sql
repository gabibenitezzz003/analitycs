-- 1. Función para actualizar Metricas Diarias (Overview)
CREATE OR REPLACE FUNCTION public.update_metricas_diarias()
RETURNS trigger AS $$
DECLARE
  dia_actual DATE;
BEGIN
  dia_actual := NEW.created_at::DATE;

  -- Insertar o actualizar
  INSERT INTO public.b41_metricas_diarias (fecha, total_mensajes, total_sesiones, total_reservas, total_consultas, valor_total, tasa_conversion)
  VALUES (
    dia_actual,
    1, -- start with 1 message
    CASE WHEN NEW.session_id IS NOT NULL THEN 1 ELSE 0 END,
    CASE WHEN NEW.es_reserva THEN 1 ELSE 0 END,
    CASE WHEN NEW.es_consulta THEN 1 ELSE 0 END,
    COALESCE(NEW.valor_oferta, 0),
    0 -- Tasa conversion calc later
  )
  ON CONFLICT (fecha) DO UPDATE SET
    total_mensajes = b41_metricas_diarias.total_mensajes + 1,
    total_sesiones = b41_metricas_diarias.total_sesiones + CASE WHEN NEW.session_id IS NOT NULL THEN 1 ELSE 0 END, -- Simplificado, idealmente count distinct session_id
    total_reservas = b41_metricas_diarias.total_reservas + CASE WHEN NEW.es_reserva THEN 1 ELSE 0 END,
    total_consultas = b41_metricas_diarias.total_consultas + CASE WHEN NEW.es_consulta THEN 1 ELSE 0 END,
    valor_total = b41_metricas_diarias.valor_total + COALESCE(NEW.valor_oferta, 0),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger para Metricas
DROP TRIGGER IF EXISTS on_interaction_update_metrics ON public.b41_interacciones;
CREATE TRIGGER on_interaction_update_metrics
AFTER INSERT ON public.b41_interacciones
FOR EACH ROW EXECUTE FUNCTION public.update_metricas_diarias();


-- 3. Función para actualizar Rutas Stats
CREATE OR REPLACE FUNCTION public.update_rutas_stats()
RETURNS trigger AS $$
BEGIN
  IF NEW.origen IS NOT NULL AND NEW.destino IS NOT NULL THEN
    INSERT INTO public.b41_rutas_stats (origen, destino, total_consultas, total_reservas, valor_promedio, ultima_actividad)
    VALUES (
      NEW.origen,
      NEW.destino,
      1,
      CASE WHEN NEW.es_reserva THEN 1 ELSE 0 END,
      COALESCE(NEW.valor_oferta, 0),
      NEW.created_at
    )
    ON CONFLICT (origen, destino) DO UPDATE SET
      total_consultas = b41_rutas_stats.total_consultas + 1,
      total_reservas = b41_rutas_stats.total_reservas + CASE WHEN NEW.es_reserva THEN 1 ELSE 0 END,
      valor_promedio = (b41_rutas_stats.valor_promedio * b41_rutas_stats.total_consultas + COALESCE(NEW.valor_oferta, 0)) / (b41_rutas_stats.total_consultas + 1),
      ultima_actividad = NEW.created_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para Rutas
DROP TRIGGER IF EXISTS on_interaction_update_rutas ON public.b41_interacciones;
CREATE TRIGGER on_interaction_update_rutas
AFTER INSERT ON public.b41_interacciones
FOR EACH ROW EXECUTE FUNCTION public.update_rutas_stats();

-- 5. Reprocesar Datos Existentes (Opcional, correr manualmente una vez)
-- INSERT INTO public.b41_interacciones_temp SELECT * FROM public.b41_interacciones; 
-- Esto dispararía los triggers si se insertan de nuevo. 
-- Mejor hacer un script de backfill si es necesario.
