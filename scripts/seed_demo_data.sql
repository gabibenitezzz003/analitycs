-- SCRIPT DE MOCK DATA "ULTIMATE" (Versión Definitiva v2)
-- Corrección: Eliminada columna 'session_id' de tabla ofertas.
-- Genera datos en TODAS las tablas necesarias para que el dashboard brille.

DO $$
DECLARE
    -- Configuración
    v_total_transportistas INTEGER := 35;
    v_total_sesiones INTEGER := 120;
    v_dias_atras INTEGER := 7;
    
    -- Iteradores y auxiliares
    v_i INTEGER;
    v_j INTEGER;
    v_t_id TEXT;
    v_s_id TEXT;
    v_fecha TIMESTAMP;
    v_base_fecha TIMESTAMP;
    v_intencion TEXT;
    v_accion TEXT;
    v_rand INTEGER;
    v_origen TEXT;
    v_destino TEXT;
    v_valor NUMERIC;
    v_estado_oferta TEXT;
    
    -- Acumuladores para métricas diarias
    v_fecha_dia DATE;
    v_total_mensajes INT;
    v_total_sesiones_dia INT;
    v_total_reservas INT;
    v_valor_total NUMERIC;
    v_tasa_fallback NUMERIC;
BEGIN
    -- 1. LIMPIEZA TOTAL (Para evitar "basura" anterior)
    -- Ajustar si el usuario prefiere no borrar, pero para demo es mejor limpiar.
    TRUNCATE TABLE public.b41_interacciones CASCADE;
    TRUNCATE TABLE public.b41_sesiones CASCADE;
    TRUNCATE TABLE public.b41_transportistas CASCADE;
    TRUNCATE TABLE public.b41_ofertas CASCADE; -- Tabla clave para Valor Total
    TRUNCATE TABLE public.b41_metricas_diarias CASCADE; -- Tabla clave para Overview Cards

    RAISE NOTICE 'Limpieza completada. Iniciando generación...';

    -- 2. GENERAR TRANSPORTISTAS
    FOR v_i IN 1..v_total_transportistas LOOP
        v_t_id := '999' || LPAD(v_i::TEXT, 8, '0'); -- 99900000001
        
        INSERT INTO public.b41_transportistas (telefono, nombre, apellido, created_at)
        VALUES (
            v_t_id, 
            (ARRAY['Juan','Carlos','Miguel','Roberto','Fernando','Luis','Diego','Pablo'])[floor(random()*8)+1], 
            (ARRAY['Perez','Gomez','Rodriguez','Lopez','Martinez','Garcia','Sanchez','Fernandez'])[floor(random()*8)+1], 
            NOW() - (random() * interval '30 days')
        ) ON CONFLICT DO NOTHING;
    END LOOP;

    -- 3. GENERAR SESIONES, INTERACCIONES Y OFERTAS
    FOR v_i IN 1..v_total_sesiones LOOP
        -- Transportista Random
        v_t_id := '999' || LPAD(floor(random() * v_total_transportistas + 1)::TEXT, 8, '0');
        v_s_id := 'sess_' || v_i || '_' || md5(random()::text);

        -- Fecha (distribución realista: más de día que de noche)
        v_base_fecha := NOW() - (floor(random() * v_dias_atras)::TEXT || ' days')::INTERVAL;
        v_base_fecha := date_trunc('day', v_base_fecha) + (8 + floor(random() * 12)) * INTERVAL '1 hour';
        
        INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at)
        VALUES (v_s_id, v_t_id, v_base_fecha, v_base_fecha);

        -- Generar Interacciones por sesión
        FOR v_j IN 1..(floor(random() * 5 + 2)) LOOP
            v_fecha := v_base_fecha + (v_j * INTERVAL '3 minutes');
            v_rand := floor(random() * 100);
            v_valor := 0; 
            v_estado_oferta := NULL;

            -- Lógica de negocio simulada
            IF v_rand < 40 THEN -- Cotizar (40%)
                v_intencion := 'cotizar'; v_accion := 'COTIZAR';
                v_origen := (ARRAY['Buenos Aires','Rosario','Córdoba','Mendoza'])[floor(random()*4)+1];
                v_destino := (ARRAY['Tucumán','Neuquén','Bahía Blanca','Mar del Plata'])[floor(random()*4)+1];
            ELSIF v_rand < 65 THEN -- Reservar (25% - Éxito!)
                v_intencion := 'reservar'; v_accion := 'RESERVAR';
                v_origen := 'Buenos Aires'; 
                v_destino := (ARRAY['Rosario','Córdoba'])[floor(random()*2)+1];
                v_valor := 500000 + floor(random() * 1000000); -- $500k a $1.5M
                v_estado_oferta := 'ACEPTADA';
            ELSIF v_rand < 80 THEN -- Negociar (15%)
                v_intencion := 'negociar'; v_accion := 'NEGOCIAR';
                v_origen := 'Buenos Aires'; v_destino := 'Córdoba';
                v_estado_oferta := 'EN_NEGOCIACION';
                v_valor := 800000;
            ELSE -- Conversación / Fallback (20%)
                IF random() < 0.3 THEN 
                   v_intencion := 'fallback'; v_accion := 'FALLBACK';
                ELSE 
                   v_intencion := 'conversacion'; v_accion := 'CONVERSACION';
                END IF;
                v_origen := NULL; v_destino := NULL;
            END IF;

            -- Insertar Interacción
            INSERT INTO public.b41_interacciones (
                session_id, telefono, mensaje_usuario, respuesta_ia, 
                intencion, accion, tiempo_respuesta_ms, tokens_usados, 
                origen, destino, created_at, es_repetitivo, es_rechazo, es_exito
            ) VALUES (
                v_s_id, v_t_id, 
                'Simulación ' || v_j, 'Respuesta IA', 
                v_intencion, v_accion, 
                1000 + floor(random() * 2000), 
                100 + floor(random() * 300), 
                v_origen, v_destino, v_fecha,
                (v_intencion = 'conversacion' AND random() < 0.2), -- Fricción simulada
                false, 
                (v_intencion = 'reservar')
            );

            -- CRÍTICO: Si es Reserva o Negociación, crear OFERTA para que el gráfico de Valor ($) funcione
            -- FIX: Eliminado session_id que no existe en tabla b41_ofertas
            IF v_estado_oferta IS NOT NULL THEN
                INSERT INTO public.b41_ofertas (
                    telefono_destino, valor_final, estado, created_at
                ) VALUES (
                    v_t_id, v_valor, v_estado_oferta, v_fecha
                );
            END IF;

        END LOOP;
    END LOOP;

    -- 4. POBLAR B41_METRICAS_DIARIAS (Crucial para Overview Cards)
    -- Agrupamos lo que acabamos de generar y lo insertamos en la tabla resumen
    INSERT INTO public.b41_metricas_diarias (
        fecha, total_mensajes, total_sesiones, total_conversaciones, 
        total_usuarios, valor_total, total_consultas, total_reservas, created_at
    )
    SELECT 
        date_trunc('day', created_at) as dia,
        COUNT(*) as msjs,
        COUNT(DISTINCT session_id) as ses,
        COUNT(*) FILTER (WHERE intencion = 'conversacion') as convs,
        COUNT(DISTINCT telefono) as usrs,
        0, -- El valor total se calcula desde ofertas
        COUNT(*) FILTER (WHERE intencion = 'cotizar' OR intencion = 'consultar'),
        COUNT(*) FILTER (WHERE intencion = 'reservar'),
        NOW()
    FROM public.b41_interacciones
    GROUP BY 1
    ON CONFLICT (fecha) DO UPDATE SET 
        total_mensajes = EXCLUDED.total_mensajes,
        total_sesiones = EXCLUDED.total_sesiones,
        total_reservas = EXCLUDED.total_reservas;
    
    -- Actualizar Valor Total en Metricas Diarias desde Ofertas
    UPDATE public.b41_metricas_diarias m
    SET valor_total = sub.suma
    FROM (
        SELECT date_trunc('day', created_at) as dia, SUM(valor_final) as suma
        FROM public.b41_ofertas
        WHERE estado = 'ACEPTADA'
        GROUP BY 1
    ) sub
    WHERE m.fecha = sub.dia;

    RAISE NOTICE 'Generación masiva completada exitosamente. V2.';
END $$;
