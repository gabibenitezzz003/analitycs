-- SCRIPT DE MOCK DATA MASIVO E INTELIGENTE
-- Genera cientos de registros distribuidos para probar visualizaciones.
-- Ejecutar y disfrutar.

DO $$
DECLARE
    -- Configuración
    v_total_transportistas INTEGER := 30;
    v_total_sesiones INTEGER := 100;
    v_dias_atras INTEGER := 7;
    
    -- Variables para iteradores
    v_t_id TEXT;
    v_s_id TEXT;
    v_nombre TEXT;
    v_apellido TEXT;
    v_fecha TIMESTAMP;
    v_base_fecha TIMESTAMP;
    v_intencion TEXT;
    v_accion TEXT;
    v_rand INTEGER;
    v_tokens INTEGER;
    v_tiempo INTEGER;
    v_es_exito BOOLEAN;
    v_origen TEXT;
    v_destino TEXT;
    v_i INTEGER; -- loop counter
    v_j INTEGER; -- loop counter
BEGIN
    -- 1. LIMPIEZA PREVIA (Opcional, comentar si se quiere acumular)
    DELETE FROM public.b41_interacciones WHERE session_id LIKE 'mock_%';
    DELETE FROM public.b41_sesiones WHERE session_id LIKE 'mock_%';
    DELETE FROM public.b41_transportistas WHERE telefono LIKE '999%';

    -- 2. GENERAR TRANSPORTISTAS (Drivers)
    FOR v_i IN 1..v_total_transportistas LOOP
        v_t_id := '999' || LPAD(v_i::TEXT, 8, '0'); -- Telefonos dummy 999...
        
        -- Nombre aleatorio
        v_rand := floor(random() * 5 + 1);
        v_nombre := CASE v_rand 
            WHEN 1 THEN 'Juan' WHEN 2 THEN 'Carlos' WHEN 3 THEN 'Miguel' WHEN 4 THEN 'Roberto' ELSE 'Fernando' 
        END;
        
        -- Apellido aleatorio
        v_rand := floor(random() * 5 + 1);
        v_apellido := CASE v_rand 
            WHEN 1 THEN 'Perez' WHEN 2 THEN 'Gomez' WHEN 3 THEN 'Rodriguez' WHEN 4 THEN 'Lopez' ELSE 'Martinez' 
        END;

        INSERT INTO public.b41_transportistas (telefono, nombre, apellido, created_at)
        VALUES (v_t_id, v_nombre, v_apellido, NOW() - (random() * interval '30 days'))
        ON CONFLICT (telefono) DO NOTHING;
    END LOOP;

    -- 3. GENERAR SESIONES E INTERACCIONES
    FOR v_i IN 1..v_total_sesiones LOOP
        -- Elegir un transportista random
        v_rand := floor(random() * v_total_transportistas + 1);
        v_t_id := '999' || LPAD(v_rand::TEXT, 8, '0');
        v_s_id := 'mock_sess_' || v_i;

        -- Fecha aleatoria en los últimos 7 días con horas pico (8am-8pm)
        v_base_fecha := NOW() - (floor(random() * v_dias_atras)::TEXT || ' days')::INTERVAL;
        v_base_fecha := date_trunc('day', v_base_fecha) + (8 + floor(random() * 12)) * INTERVAL '1 hour' + (floor(random()*60) * INTERVAL '1 minute');

        INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at)
        VALUES (v_s_id, v_t_id, v_base_fecha, v_base_fecha)
        ON CONFLICT (session_id) DO NOTHING;

        -- Generar 3-6 interacciones por sesión
        FOR v_j IN 1..(floor(random() * 4 + 3)) LOOP
            v_fecha := v_base_fecha + (v_j * INTERVAL '2 minutes');
            
            -- Lógica Clave: Definir historias por probabilidad
            v_rand := floor(random() * 100);
            
            IF v_rand < 40 THEN
                -- 40% Cotizaciones (Mix de rutas)
                v_intencion := 'cotizar'; v_accion := 'COTIZAR';
                v_tokens := 150 + floor(random() * 100);
                v_tiempo := 1500 + floor(random() * 2000);
                v_es_exito := false;
                
                -- Rutas Hot (Buenos Aires -> Interior)
                IF random() < 0.6 THEN
                    v_origen := 'Buenos Aires';
                    v_destino := CASE floor(random() * 3) 
                        WHEN 0 THEN 'Rosario' WHEN 1 THEN 'Córdoba' ELSE 'Mendoza' END;
                ELSE
                     v_origen := CASE floor(random() * 3) 
                        WHEN 0 THEN 'Bahía Blanca' WHEN 1 THEN 'Santa Fe' ELSE 'Neuquén' END;
                     v_destino := 'Buenos Aires';
                END IF;

            ELSIF v_rand < 60 THEN
                 -- 20% Negociaciones (Algunas terminan en rechazo)
                 v_intencion := 'negociar'; v_accion := 'NEGOCIAR';
                 v_tokens := 200 + floor(random() * 100);
                 v_tiempo := 2000 + floor(random() * 1500);
                 v_origen := 'Buenos Aires'; v_destino := 'Tucumán';
                 v_es_exito := false;

            ELSIF v_rand < 80 THEN
                 -- 20% Reservas (Exito!)
                 v_intencion := 'reservar'; v_accion := 'RESERVAR';
                 v_tokens := 300 + floor(random() * 100);
                 v_tiempo := 1200 + floor(random() * 1000);
                 v_origen := 'Buenos Aires'; v_destino := 'Córdoba';
                 v_es_exito := true;

            ELSE
                 -- 20% Otros (Conversacion, Fallback)
                 IF random() < 0.5 THEN
                    v_intencion := 'conversacion'; v_accion := 'CONVERSACION';
                 ELSE
                    v_intencion := 'fallback'; v_accion := 'FALLBACK';
                 END IF;
                 v_tokens := 100; v_tiempo := 800;
                 v_origen := NULL; v_destino := NULL;
                 v_es_exito := false;
            END IF;

            -- Insertar Interacción
            INSERT INTO public.b41_interacciones (
                session_id, telefono, mensaje_usuario, respuesta_ia, 
                intencion, accion, tiempo_respuesta_ms, tokens_usados, 
                origen, destino, created_at, 
                es_repetitivo, es_rechazo, es_exito
            )
            VALUES (
                v_s_id, v_t_id, 
                'Mensaje simulado ' || v_j, 
                'Respuesta simulada ' || v_j, 
                v_intencion, v_accion, 
                v_tiempo, v_tokens, 
                v_origen, v_destino, v_fecha,
                (random() < 0.05), -- 5% chance es repetitivo
                (v_intencion = 'negociar' AND random() < 0.3), -- 30% negociaciones se rechazan
                v_es_exito
            );
        END LOOP;
    END LOOP;
END $$;
