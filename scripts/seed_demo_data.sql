-- SCRIPT DE DATOS DE PRUEBA (MOCK DATA)
-- Ejecutar para poblar el dashboard.
-- Para limpiar, usar reset_data.sql

-- 1. Transportistas Dummy
INSERT INTO public.b41_transportistas (telefono, nombre, apellido, created_at)
VALUES 
('5491100000001', 'Juan', 'Perez', NOW() - INTERVAL '7 days'),
('5491100000002', 'Carlos', 'Gomez', NOW() - INTERVAL '5 days'),
('5491100000003', 'Miguel', 'Rodriguez', NOW() - INTERVAL '3 days')
ON CONFLICT (telefono) DO NOTHING;

-- 2. Sesiones Dummy (Generamos varias sesiones en los ultimos 7 dias)
INSERT INTO public.b41_sesiones (session_id, telefono, inicio, created_at)
VALUES
('mock_sess_1', '5491100000001', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('mock_sess_2', '5491100000002', NOW() - INTERVAL '4 days 2 hours', NOW() - INTERVAL '4 days 2 hours'),
('mock_sess_3', '5491100000003', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('mock_sess_4', '5491100000001', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours')
ON CONFLICT (session_id) DO NOTHING;

-- 3. Interacciones (Variedad de casos)
INSERT INTO public.b41_interacciones (
    session_id, telefono, mensaje_usuario, respuesta_ia, intencion, accion, 
    tiempo_respuesta_ms, tokens_usados, origen, destino, created_at, es_repetitivo, es_rechazo, es_exito
)
VALUES
-- Caso Exitoso (Reserva) - Juan Perez
('mock_sess_1', '5491100000001', 'Hola tengo camion', 'Hola Juan, ¿qué camión tenés?', 'conversacion', 'CONVERSACION', 1200, 150, NULL, NULL, NOW() - INTERVAL '6 days', false, false, false),
('mock_sess_1', '5491100000001', 'Tengo un semi de 14m', 'Perfecto. ¿Buscas carga desde Buenos Aires?', 'cotizar', 'COTIZAR', 2500, 200, 'Buenos Aires', NULL, NOW() - INTERVAL '6 days 23 hours', false, false, false),
('mock_sess_1', '5491100000001', 'Si, a Rosario', 'Tengo una carga de 28TN a Rosario por $500k. ¿Te sirve?', 'cotizar', 'COTIZAR', 3100, 250, 'Buenos Aires', 'Rosario', NOW() - INTERVAL '6 days 23 hours 55 min', false, false, false),
('mock_sess_1', '5491100000001', 'Si dale, reservamela', '¡Hecho! Tu carga está reservada. #12345', 'reservar', 'RESERVAR', 1800, 300, 'Buenos Aires', 'Rosario', NOW() - INTERVAL '6 days 23 hours 58 min', false, false, true),

-- Caso Rechazo - Carlos (Busca precio alto)
('mock_sess_2', '5491100000002', 'Precio para cordoba?', 'Hola Carlos. Tengo a $800k. ¿Te interesa?', 'cotizar', 'COTIZAR', 900, 180, 'Buenos Aires', 'Cordoba', NOW() - INTERVAL '4 days 2 hours', false, false, false),
('mock_sess_2', '5491100000002', 'No muy barato', 'Entiendo. ¿Cuánto pedís vos?', 'negociar', 'NEGOCIAR', 1500, 210, 'Buenos Aires', 'Cordoba', NOW() - INTERVAL '4 days 1 hour', false, false, false),
('mock_sess_2', '5491100000002', 'Quiero 1 millon', 'Lo siento, no llegamos a ese número. La oferta máxima es $850k.', 'negociar', 'NEGOCIAR', 2200, 230, 'Buenos Aires', 'Cordoba', NOW() - INTERVAL '4 days 55 min', false, false, false),
('mock_sess_2', '5491100000002', 'Deja, no me sirve', 'Entendido, gracias por consultar.', 'rechazar', 'RECHAZAR', 1100, 150, 'Buenos Aires', 'Cordoba', NOW() - INTERVAL '4 days 50 min', false, true, false),

-- Caso Fricción (Loop) - Miguel
('mock_sess_3', '5491100000003', 'Hola', 'Hola Miguel, ¿en qué puedo ayudarte?', 'conversacion', 'CONVERSACION', 800, 120, NULL, NULL, NOW() - INTERVAL '1 day', false, false, false),
('mock_sess_3', '5491100000003', 'Hola??', 'Hola Miguel, te escucho. ¿Buscas carga?', 'conversacion', 'CONVERSACION', 900, 130, NULL, NULL, NOW() - INTERVAL '1 day', true, false, false),
('mock_sess_3', '5491100000003', 'Hay alguien?', 'Sí, soy el asistente virtual de B41. Decime tu ubicación.', 'conversacion', 'CONVERSACION', 1000, 140, NULL, NULL, NOW() - INTERVAL '1 day', true, false, false),

-- Reciente (Hoy)
('mock_sess_4', '5491100000001', 'Tenes algo hoy?', 'Hola Juan de nuevo. Tengo cargas a Mar del Plata.', 'consultar', 'CONSULTAR', 1300, 190, NULL, NULL, NOW() - INTERVAL '1 hour', false, false, false);
