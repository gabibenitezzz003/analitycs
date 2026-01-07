-- SCRIPT DE DATOS REALISTAS V2.1 (Corrección: Distribución Geográfica LATAM)
-- Ejecutar en Supabase SQL Editor

-- 1. ACTUALIZAR ESQUEMA (Transportistas y Métricas)
DO $$
BEGIN
    -- Transportistas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'b41_transportistas' AND column_name = 'estado') THEN
        ALTER TABLE public.b41_transportistas ADD COLUMN estado TEXT DEFAULT 'ACTIVO';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'b41_transportistas' AND column_name = 'ranking') THEN
        ALTER TABLE public.b41_transportistas ADD COLUMN ranking DECIMAL(3,1) DEFAULT 0.0;
    END IF;

    -- Métricas Diarias
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'b41_metricas_diarias' AND column_name = 'tiempo_promedio') THEN
        ALTER TABLE public.b41_metricas_diarias ADD COLUMN tiempo_promedio DECIMAL(10,2) DEFAULT 0.0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'b41_metricas_diarias' AND column_name = 'tasa_conversion') THEN
        ALTER TABLE public.b41_metricas_diarias ADD COLUMN tasa_conversion DECIMAL(5,2) DEFAULT 0.0;
    END IF;
END $$;

-- 2. LIMPIAR DATOS ANTERIORES
DELETE FROM public.b41_interacciones WHERE session_id LIKE 'sess_%';
DELETE FROM public.b41_sesiones WHERE session_id LIKE 'sess_%';
DELETE FROM public.b41_ofertas WHERE telefono_destino LIKE '999%';
DELETE FROM public.b41_transportistas WHERE telefono LIKE '999%';
DELETE FROM public.b41_metricas_diarias WHERE created_at > NOW() - INTERVAL '100 days';

-- 3. TRANSPORTISTAS (40 Realistas)
INSERT INTO public.b41_transportistas (telefono, nombre, apellido, estado, ranking, created_at) VALUES
('99911111111', 'Juan', 'Pérez', 'ACTIVO', 4.8, NOW() - INTERVAL '45 days'),
('99911111112', 'Carlos', 'Gómez', 'ACTIVO', 4.5, NOW() - INTERVAL '30 days'),
('99911111113', 'Miguel', 'Rodríguez', 'INACTIVO', 3.9, NOW() - INTERVAL '60 days'),
('99911111114', 'Roberto', 'López', 'ACTIVO', 5.0, NOW() - INTERVAL '15 days'),
('99911111115', 'Fernando', 'Martínez', 'PENDIENTE', 0.0, NOW() - INTERVAL '2 days'),
('99911111116', 'Luis', 'González', 'ACTIVO', 4.2, NOW() - INTERVAL '20 days'),
('99911111117', 'Jorge', 'Sánchez', 'BLOQUEADO', 2.1, NOW() - INTERVAL '10 days'),
('99911111118', 'Ricardo', 'Díaz', 'ACTIVO', 4.7, NOW() - INTERVAL '5 days'),
('99911111119', 'Marcelo', 'Fernández', 'ACTIVO', 4.9, NOW() - INTERVAL '100 days'),
('99911111120', 'Sergio', 'Torres', 'ACTIVO', 4.6, NOW() - INTERVAL '80 days'),
('99911111121', 'Andrés', 'Ruiz', 'ACTIVO', 4.1, NOW() - INTERVAL '90 days'),
('99911111122', 'Gabriel', 'Castro', 'ACTIVO', 4.3, NOW() - INTERVAL '25 days'),
('99911111123', 'Héctor', 'Morales', 'INACTIVO', 3.5, NOW() - INTERVAL '70 days'),
('99911111124', 'Diego', 'Ramírez', 'ACTIVO', 4.8, NOW() - INTERVAL '12 days'),
('99911111125', 'Javier', 'Herrera', 'PENDIENTE', 0.0, NOW() - INTERVAL '1 day')
ON CONFLICT (telefono) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    estado = EXCLUDED.estado,
    ranking = EXCLUDED.ranking;

-- 4. GENERACIÓN MASIVA DE HISTORIAL (90 Días)
DO $$
DECLARE
    curr_date DATE;
    start_date DATE := CURRENT_DATE - 90;
    
    daily_msgs INT;
    daily_sessions INT;
    daily_reserves INT;
    daily_value DECIMAL;
    tasa_conv DECIMAL;
    
    i INT;
    rnd_driver TEXT;
    session_uuid TEXT;
    rnd_hour INT;
    rnd_min INT;
    ts TIMESTAMP;
    
    routes TEXT[][] := ARRAY[
       ['Buenos Aires', 'Córdoba'],
       ['Mendoza', 'Santiago'], -- Cruce a Chile
       ['Buenos Aires', 'Montevideo'], -- Cruce a Uruguay
       ['Rosario', 'São Paulo'], -- Cruce a Brasil a larga distancia
       ['Córdoba', 'Tucumán'],
       ['Salta', 'La Paz'], -- Cruce a Bolivia
       ['Buenos Aires', 'Rosario'],
       ['Asunción', 'Formosa'], -- Frontera
       ['Buenos Aires', 'Mar del Plata'],
       ['Lima', 'Santiago'] -- Ruta Pacífico
    ];
    selected_route TEXT[];
BEGIN
    curr_date := start_date;
    
    WHILE curr_date <= CURRENT_DATE LOOP
        daily_msgs := 10 + floor(random() * 20); -- Reducido de 20-60 a 10-30
        daily_sessions := 2 + floor(random() * 4); -- Reducido significativamente a 2-6 por día (antes 5-15)
        daily_reserves := floor(daily_sessions * 0.3); 
        daily_value := daily_reserves * (500000 + floor(random() * 1500000));
        
        IF daily_sessions > 0 THEN
            tasa_conv := daily_reserves::decimal / daily_sessions;
        ELSE
            tasa_conv := 0;
        END IF;

        INSERT INTO public.b41_metricas_diarias (
            fecha, total_mensajes, total_sesiones, total_reservas, valor_total, 
            tasa_conversion, tiempo_promedio, created_at
        ) VALUES (
            curr_date, daily_msgs, daily_sessions, daily_reserves, daily_value,
            tasa_conv, 
            22.0 + random()*5, -- Tiempo promedio diario (22s a 27s)
            NOW()
        ) ON CONFLICT (fecha) DO UPDATE SET
            total_mensajes = EXCLUDED.total_mensajes,
            total_sesiones = EXCLUDED.total_sesiones,
            total_reservas = EXCLUDED.total_reservas,
            valor_total = EXCLUDED.valor_total,
            tasa_conversion = EXCLUDED.tasa_conversion,
            tiempo_promedio = EXCLUDED.tiempo_promedio;
            
        -- Generar Sesiones e Interacciones
        FOR i IN 1..daily_sessions LOOP
            rnd_driver := '999111111' || (11 + floor(random() * 14))::text;
            session_uuid := 'sess_' || to_char(curr_date, 'YYYYMMDD') || '_' || i;
            rnd_hour := 8 + floor(random() * 12);
            rnd_min := floor(random() * 60);
            ts := curr_date + make_interval(hours := rnd_hour, mins := rnd_min);
            
            -- Pick a Random Route
            selected_route := routes[1 + floor(random() * array_length(routes, 1))];
            
            INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at) 
            VALUES (session_uuid, rnd_driver, ts, ts) ON CONFLICT DO NOTHING;
            
            -- Interacción 1: Consulta
            INSERT INTO public.b41_interacciones (
                session_id, telefono, mensaje_usuario, respuesta_ia, intencion, accion, 
                tiempo_respuesta_ms, tokens_usados, origen, destino, created_at, es_exito
            ) VALUES
            (session_uuid, rnd_driver, 'Hola, hay viaje?', 'Tengo cargas disponibles de ' || selected_route[1] || ' a ' || selected_route[2], 'consultar', 'CONSULTAR', 
             22000 + floor(random() * 10000), 100, selected_route[1], selected_route[2], ts + INTERVAL '25 seconds', true);
             
             -- 15% Probabilidad de FALLO con motivos variados
             IF random() < 0.15 THEN
                 -- Seleccionar un motivo aleatorio y guardarlo en rnd_msg (no sobrescribir rnd_driver)
                 DECLARE
                    rnd_msg TEXT;
                 BEGIN
                     rnd_msg := (ARRAY[
                        'El precio es muy caro, no me sirve', 
                        'No llegan a San Luis? necesito esa ruta', 
                        'El horario de carga no me conviene, tardan mucho',
                        'kdsjf kdsjf', 
                        'Quiero hablar con un humano por favor'
                     ])[floor(random()*5)+1];

                     INSERT INTO public.b41_interacciones (
                        session_id, telefono, mensaje_usuario, respuesta_ia, intencion, accion, 
                        tiempo_respuesta_ms, tokens_usados, origen, destino, created_at, es_exito
                    ) VALUES
                    (session_uuid, rnd_driver, rnd_msg, 'Disculpa, no pude procesar tu solicitud.', 'fallback', 'FALLBACK', 
                     25000 + floor(random() * 5000), 50, NULL, NULL, ts + INTERVAL '2 minutes', false);
                 END;
             
             -- Si no falla, probar Reserva con la ruta seleccionada
             ELSIF i <= daily_reserves THEN
                INSERT INTO public.b41_interacciones (
                    session_id, telefono, mensaje_usuario, respuesta_ia, intencion, accion, 
                    tiempo_respuesta_ms, tokens_usados, origen, destino, created_at, es_exito
                ) VALUES 
                (session_uuid, rnd_driver, 'Reservar viaje', 'Reservado #B41-' || floor(random()*9999), 'reservar', 'RESERVAR', 
                 23000 + floor(random() * 5000), 200, selected_route[1], selected_route[2], ts + INTERVAL '1 minute', true);
             END IF;
        END LOOP;
        
        curr_date := curr_date + 1;
    END LOOP;

    -- 5. GENERACIÓN GARANTIZADA POR TRANSPORTISTA (Para Mapa Rich Data - Mínimo 5 viajes c/u)
    -- Iteramos sobre cada transportista activo para asegurarnos que tenga historial para el mapa
    FOR rnd_driver IN SELECT telefono FROM public.b41_transportistas WHERE estado = 'ACTIVO' LOOP
        -- Generar entre 5 y 10 viajes adicionales para este chofer específico
        FOR i IN 1..(5 + floor(random() * 5)) LOOP
            -- Random date in last 90 days
            ts := NOW() - (floor(random() * 90) || ' days')::interval;
            session_uuid := 'sess_hist_' || rnd_driver || '_' || i;
            
            -- Random Route
            selected_route := routes[1 + floor(random() * array_length(routes, 1))];

            INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at) 
            VALUES (session_uuid, rnd_driver, ts, ts) ON CONFLICT DO NOTHING;

            -- Interacción y Reserva Exitosa (para que sume al mapa)
            INSERT INTO public.b41_interacciones (
                session_id, telefono, mensaje_usuario, respuesta_ia, intencion, accion, 
                tiempo_respuesta_ms, tokens_usados, origen, destino, created_at, es_exito
            ) VALUES 
            (session_uuid, rnd_driver, 'Historial garantizado', 'Viaje completado: ' || selected_route[1] || ' -> ' || selected_route[2], 'reservar', 'RESERVAR', 
             22000, 150, selected_route[1], selected_route[2], ts, true);
        END LOOP;
    END LOOP;

END $$;
