-- SCRIPT DE DATOS DEMO REALISTA (Con errores, fallbacks y fricción)
-- Ejecutar en Supabase SQL Editor

-- 1. LIMPIAR DATOS MOCK ANTERIORES
DELETE FROM public.b41_interacciones WHERE session_id LIKE 'sess_%';
DELETE FROM public.b41_sesiones WHERE session_id LIKE 'sess_%';
DELETE FROM public.b41_ofertas WHERE telefono_destino LIKE '999%';
DELETE FROM public.b41_transportistas WHERE telefono LIKE '999%';
DELETE FROM public.b41_metricas_diarias WHERE created_at > NOW() - INTERVAL '8 days';

-- 2. TRANSPORTISTAS (5 drivers)
INSERT INTO public.b41_transportistas (telefono, nombre, apellido, created_at) VALUES
('99900000001', 'Juan', 'Perez', NOW() - INTERVAL '10 days'),
('99900000002', 'Carlos', 'Gomez', NOW() - INTERVAL '8 days'),
('99900000003', 'Miguel', 'Rodriguez', NOW() - INTERVAL '6 days'),
('99900000004', 'Roberto', 'Lopez', NOW() - INTERVAL '4 days'),
('99900000005', 'Fernando', 'Martinez', NOW() - INTERVAL '2 days')
ON CONFLICT (telefono) DO NOTHING;

-- 3. SESIONES (15 sesiones en los últimos 7 días)
INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at) VALUES
('sess_001', '99900000001', NOW() - INTERVAL '6 days 10 hours', NOW() - INTERVAL '6 days 10 hours'),
('sess_002', '99900000002', NOW() - INTERVAL '5 days 14 hours', NOW() - INTERVAL '5 days 14 hours'),
('sess_003', '99900000003', NOW() - INTERVAL '4 days 9 hours', NOW() - INTERVAL '4 days 9 hours'),
('sess_004', '99900000001', NOW() - INTERVAL '3 days 16 hours', NOW() - INTERVAL '3 days 16 hours'),
('sess_005', '99900000004', NOW() - INTERVAL '2 days 11 hours', NOW() - INTERVAL '2 days 11 hours'),
('sess_006', '99900000002', NOW() - INTERVAL '1 day 15 hours', NOW() - INTERVAL '1 day 15 hours'),
('sess_007', '99900000005', NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours'),
('sess_008', '99900000003', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
('sess_009', '99900000001', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
('sess_010', '99900000004', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('sess_011', '99900000002', NOW() - INTERVAL '4 days 12 hours', NOW() - INTERVAL '4 days 12 hours'),
('sess_012', '99900000005', NOW() - INTERVAL '3 days 8 hours', NOW() - INTERVAL '3 days 8 hours'),
('sess_013', '99900000003', NOW() - INTERVAL '2 days 14 hours', NOW() - INTERVAL '2 days 14 hours'),
('sess_014', '99900000001', NOW() - INTERVAL '1 day 10 hours', NOW() - INTERVAL '1 day 10 hours'),
('sess_015', '99900000004', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours')
ON CONFLICT (session_id) DO NOTHING;

-- 4. INTERACCIONES REALISTAS (40% éxito, 15% fallback, 10% fricción)
INSERT INTO public.b41_interacciones (
    session_id, telefono, mensaje_usuario, respuesta_ia, 
    intencion, accion, tiempo_respuesta_ms, tokens_usados, 
    origen, destino, created_at, es_repetitivo, es_rechazo, es_exito
) VALUES
-- ÉXITOS (Reservas confirmadas)
('sess_001', '99900000001', 'Bs As a Rosario', 'Tengo carga 28TN a $800k', 'cotizar', 'COTIZAR', 2500, 250, 'Buenos Aires', 'Rosario', NOW() - INTERVAL '6 days 10 hours', false, false, false),
('sess_001', '99900000001', 'Dale, reservo', 'Confirmado! #B41-001', 'reservar', 'RESERVAR', 1800, 300, 'Buenos Aires', 'Rosario', NOW() - INTERVAL '6 days 9 hours 58 min', false, false, true),
('sess_004', '99900000001', 'La de Córdoba la tomo', 'Perfecto! #B41-002', 'reservar', 'RESERVAR', 1500, 280, 'Buenos Aires', 'Córdoba', NOW() - INTERVAL '3 days 16 hours', false, false, true),
('sess_006', '99900000002', 'Bs As - Tucumán?', 'Tengo a $950k', 'cotizar', 'COTIZAR', 1700, 190, 'Buenos Aires', 'Tucumán', NOW() - INTERVAL '1 day 15 hours', false, false, false),
('sess_006', '99900000002', 'Va, reservo', 'Listo! #B41-003', 'reservar', 'RESERVAR', 1600, 290, 'Buenos Aires', 'Tucumán', NOW() - INTERVAL '1 day 14 hours 58 min', false, false, true),
('sess_014', '99900000001', 'Necesito viaje urgente', 'Rosario disponible ahora', 'cotizar', 'COTIZAR', 1900, 210, 'Buenos Aires', 'Rosario', NOW() - INTERVAL '1 day 10 hours', false, false, false),
('sess_014', '99900000001', 'Lo tomo!', 'Reservado! #B41-004', 'reservar', 'RESERVAR', 1400, 260, 'Buenos Aires', 'Rosario', NOW() - INTERVAL '1 day 9 hours 58 min', false, false, true),

-- RECHAZOS (No acepta precio)
('sess_002', '99900000002', 'Precio a Córdoba?', 'Tengo a $600k', 'cotizar', 'COTIZAR', 1500, 180, 'Buenos Aires', 'Córdoba', NOW() - INTERVAL '5 days 14 hours', false, false, false),
('sess_002', '99900000002', 'Muy poco, necesito $900k', 'Puedo ofrecerte $700k', 'negociar', 'NEGOCIAR', 2200, 220, 'Buenos Aires', 'Córdoba', NOW() - INTERVAL '5 days 13 hours 55 min', false, false, false),
('sess_002', '99900000002', 'No me sirve', 'Entendido, gracias!', 'rechazar', 'RECHAZAR', 1100, 150, 'Buenos Aires', 'Córdoba', NOW() - INTERVAL '5 days 13 hours 50 min', false, true, false),
('sess_011', '99900000002', 'Muy caro todo', 'Entiendo, ¿quieres otra opción?', 'rechazar', 'RECHAZAR', 1300, 140, NULL, NULL, NOW() - INTERVAL '4 days 12 hours', false, true, false),

-- FALLBACKS (IA no entendió)
('sess_008', '99900000003', 'asdfgh', 'No entendí, ¿podés reformular?', 'fallback', 'FALLBACK', 800, 80, NULL, NULL, NOW() - INTERVAL '12 hours', false, false, false),
('sess_008', '99900000003', 'dfghjk', 'Perdón, no logro entender. Intenta con "busco carga"', 'fallback', 'FALLBACK', 750, 75, NULL, NULL, NOW() - INTERVAL '11 hours 59 min', false, false, false),
('sess_008', '99900000003', 'Cargas hoy', 'Tengo para Rosario y Córdoba', 'consultar', 'CONSULTAR', 1300, 160, NULL, NULL, NOW() - INTERVAL '11 hours 58 min', false, false, false),
('sess_013', '99900000003', '???', 'No entiendo. ¿Buscas una carga?', 'fallback', 'FALLBACK', 900, 85, NULL, NULL, NOW() - INTERVAL '2 days 14 hours', false, false, false),
('sess_015', '99900000004', 'kjhgfd', 'Reformula por favor', 'fallback', 'FALLBACK', 820, 78, NULL, NULL, NOW() - INTERVAL '5 hours', false, false, false),

-- FRICCIÓN (Repeticiones)
('sess_005', '99900000004', 'Hola', 'Hola Roberto, ¿en qué te ayudo?', 'conversacion', 'CONVERSACION', 800, 90, NULL, NULL, NOW() - INTERVAL '2 days 11 hours', false, false, false),
('sess_005', '99900000004', 'Hola??', 'Te escucho Roberto', 'conversacion', 'CONVERSACION', 900, 95, NULL, NULL, NOW() - INTERVAL '2 days 10 hours 58 min', true, false, false),
('sess_005', '99900000004', 'Hola???', 'Estoy aquí, ¿qué necesitas?', 'conversacion', 'CONVERSACION', 950, 98, NULL, NULL, NOW() - INTERVAL '2 days 10 hours 56 min', true, false, false),
('sess_012', '99900000005', 'Tenés cargas?', 'Sí, varias rutas', 'consultar', 'CONSULTAR', 1100, 130, NULL, NULL, NOW() - INTERVAL '3 days 8 hours', false, false, false),
('sess_012', '99900000005', 'Tenés cargas??', 'Ya te respondí, sí tengo', 'consultar', 'CONSULTAR', 1200, 135, NULL, NULL, NOW() - INTERVAL '3 days 7 hours 59 min', true, false, false),

-- COTIZACIONES SIMPLES (sin reserva)
('sess_003', '99900000003', 'Tenés algo para Mendoza?', 'Sí, tengo carga a $1.2M', 'cotizar', 'COTIZAR', 1800, 200, 'Buenos Aires', 'Mendoza', NOW() - INTERVAL '4 days 9 hours', false, false, false),
('sess_003', '99900000003', 'Déjame consultar', 'Ok, avisame', 'conversacion', 'CONVERSACION', 900, 100, NULL, NULL, NOW() - INTERVAL '4 days 8 hours 55 min', false, false, false),
('sess_007', '99900000005', 'Info de cargas', 'Tengo varias rutas disponibles', 'consultar', 'CONSULTAR', 1100, 140, NULL, NULL, NOW() - INTERVAL '18 hours', false, false, false),
('sess_009', '99900000001', 'Qué tenés para hoy?', 'Mar del Plata $700k', 'cotizar', 'COTIZAR', 1400, 170, 'Buenos Aires', 'Mar del Plata', NOW() - INTERVAL '6 hours', false, false, false),
('sess_010', '99900000004', 'Hay algo?', 'Sí, varias opciones', 'consultar', 'CONSULTAR', 1000, 130, NULL, NULL, NOW() - INTERVAL '2 hours', false, false, false);

-- 5. OFERTAS (Solo las confirmadas)
INSERT INTO public.b41_ofertas (telefono_destino, valor_final, estado, created_at) VALUES
('99900000001', 800000, 'ACEPTADA', NOW() - INTERVAL '6 days 9 hours 55 min'),
('99900000001', 600000, 'ACEPTADA', NOW() - INTERVAL '3 days 16 hours'),
('99900000002', 950000, 'ACEPTADA', NOW() - INTERVAL '1 day 14 hours 58 min'),
('99900000001', 820000, 'ACEPTADA', NOW() - INTERVAL '1 day 9 hours 58 min')
ON CONFLICT DO NOTHING;

-- 6. ACTUALIZAR METRICAS DIARIAS
INSERT INTO public.b41_metricas_diarias (
    fecha, total_mensajes, total_sesiones, total_reservas, valor_total, created_at
)
SELECT 
    CURRENT_DATE - 6, 4, 2, 1, 800000, NOW()
UNION ALL SELECT CURRENT_DATE - 5, 3, 1, 0, 0, NOW()
UNION ALL SELECT CURRENT_DATE - 4, 4, 2, 0, 0, NOW()
UNION ALL SELECT CURRENT_DATE - 3, 3, 2, 1, 600000, NOW()
UNION ALL SELECT CURRENT_DATE - 2, 5, 2, 0, 0, NOW()
UNION ALL SELECT CURRENT_DATE - 1, 4, 2, 2, 1770000, NOW()
UNION ALL SELECT CURRENT_DATE, 6, 3, 0, 0, NOW()
ON CONFLICT (fecha) DO UPDATE SET 
    total_mensajes = EXCLUDED.total_mensajes,
    total_sesiones = EXCLUDED.total_sesiones,
    total_reservas = EXCLUDED.total_reservas,
    valor_total = EXCLUDED.valor_total;
