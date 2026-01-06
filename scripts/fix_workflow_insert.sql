-- SCRIPT CORREGIDO (Orden de Parámetros)
-- postgresql requiere que los parámetros con DEFAULT vayan AL FINAL.

-- 1. Agregar columnas de Nombre/Apellido si no existen (Igual que antes)
ALTER TABLE public.b41_transportistas
ADD COLUMN IF NOT EXISTS nombre TEXT,
ADD COLUMN IF NOT EXISTS apellido TEXT;

-- 2. Función Maestra CORREGIDA
CREATE OR REPLACE FUNCTION public.registrar_interaccion_workflow(
    -- === PARÁMETROS OBLIGATORIOS (Sin Default) ===
    p_telefono TEXT,
    p_session_id TEXT,
    p_mensaje_usuario TEXT,
    p_respuesta_ia TEXT,
    p_intencion TEXT,
    p_accion TEXT,
    
    -- === PARÁMETROS OPCIONALES (Con Default) ===
    p_nombre TEXT DEFAULT NULL,
    p_apellido TEXT DEFAULT NULL,
    p_tiempo_respuesta NUMERIC DEFAULT 0,
    p_origen TEXT DEFAULT NULL,
    p_destino TEXT DEFAULT NULL,
    p_valor_oferta NUMERIC DEFAULT NULL,
    p_moneda TEXT DEFAULT 'ARS'
)
RETURNS JSON AS $$
DECLARE
    v_interaction_id UUID;
BEGIN
    -- A. "Upsert" Transportista
    INSERT INTO public.b41_transportistas (telefono, nombre, apellido, created_at)
    VALUES (p_telefono, p_nombre, p_apellido, NOW())
    ON CONFLICT (telefono) DO UPDATE SET
        nombre = COALESCE(EXCLUDED.nombre, b41_transportistas.nombre),
        apellido = COALESCE(EXCLUDED.apellido, b41_transportistas.apellido),
        updated_at = NOW();

    -- B. "Upsert" Sesión
    INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at)
    VALUES (p_session_id, p_telefono, NOW(), NOW())
    ON CONFLICT (session_id) DO NOTHING;

    -- C. Insertar la Interacción
    INSERT INTO public.b41_interacciones (
        session_id,
        telefono,
        mensaje_usuario,
        respuesta_ia,
        intencion,
        accion,
        tiempo_respuesta_ms,
        origen,
        destino,
        valor_oferta,
        moneda,
        created_at
    )
    VALUES (
        p_session_id,
        p_telefono,
        p_mensaje_usuario,
        p_respuesta_ia,
        p_intencion,
        p_accion,
        p_tiempo_respuesta,
        p_origen,
        p_destino,
        p_valor_oferta,
        p_moneda,
        NOW()
    )
    RETURNING id INTO v_interaction_id;

    RETURN json_build_object(
        'success', true,
        'interaction_id', v_interaction_id
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
