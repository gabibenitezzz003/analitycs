-- SCRIPT DE NORMALIZACIÓN DE LUGARES (LATAM)

-- 1. Crear tabla de Canonical Places
CREATE TABLE IF NOT EXISTS public.b41_lugares_canonicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    input_text TEXT NOT NULL UNIQUE, -- Lo que escribe el usuario o captura la IA (ej: "bs as")
    nombre_oficial TEXT NOT NULL,    -- El nombre limpio (ej: "Buenos Aires, AR")
    pais TEXT,                       -- Contexto (AR, BR, CL, UY, PY)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Poblar con sinónimos comunes (Seed Data)
INSERT INTO public.b41_lugares_canonicos (input_text, nombre_oficial, pais) VALUES
-- ARGENTINA
('bs as', 'Buenos Aires, AR', 'AR'),
('bais', 'Buenos Aires, AR', 'AR'),
('caba', 'Buenos Aires, AR', 'AR'),
('cap fed', 'Buenos Aires, AR', 'AR'),
('capital federal', 'Buenos Aires, AR', 'AR'),
('cordoba', 'Córdoba, AR', 'AR'),
('cba', 'Córdoba, AR', 'AR'),
('rosario', 'Rosario, AR', 'AR'),
('mdz', 'Mendoza, AR', 'AR'),
('mendoza', 'Mendoza, AR', 'AR'),

-- CHILE
('santiago', 'Santiago, CL', 'CL'),
('stgo', 'Santiago, CL', 'CL'),
('rm', 'Santiago, CL', 'CL'),
('valpo', 'Valparaíso, CL', 'CL'),

-- URUGUAY
('mvd', 'Montevideo, UY', 'UY'),
('montevideo', 'Montevideo, UY', 'UY'),

-- PARAGUAY
('asu', 'Asunción, PY', 'PY'),
('asuncion', 'Asunción, PY', 'PY'),
('cde', 'Ciudad del Este, PY', 'PY'),

-- BRASIL
('sp', 'São Paulo, BR', 'BR'),
('sao paulo', 'São Paulo, BR', 'BR'),
('rio', 'Rio de Janeiro, BR', 'BR'),
('rj', 'Rio de Janeiro, BR', 'BR'),
('curitiba', 'Curitiba, BR', 'BR'),
('poa', 'Porto Alegre, BR', 'BR'),

-- PERU
('lima', 'Lima, PE', 'PE'),
('lim', 'Lima, PE', 'PE'),

-- COLOMBIA
('bogota', 'Bogotá, CO', 'CO'),
('bog', 'Bogotá, CO', 'CO'),
('medellin', 'Medellín, CO', 'CO'),

-- BOLIVIA
('la paz', 'La Paz, BO', 'BO'),
('scz', 'Santa Cruz, BO', 'BO'),
('santa cruz', 'Santa Cruz, BO', 'BO'),

-- ECUADOR
('quito', 'Quito, EC', 'EC'),
('gye', 'Guayaquil, EC', 'EC'),

-- VENEZUELA
('ccs', 'Caracas, VE', 'VE'),
('caracas', 'Caracas, VE', 'VE')

ON CONFLICT (input_text) DO NOTHING;

-- NOTA: Si llega una ciudad que NO está en esta lista (ej: "Madrid"),
-- el sistema igual la guardará, solo que le aplicará Mayúscula Inicial ("Madrid").
-- Esta tabla es SOLO para corregir abreviaturas o errores comunes.


-- 3. Función Normalizadora
CREATE OR REPLACE FUNCTION public.normalize_interaction_locations()
RETURNS trigger AS $$
DECLARE
    normalized_origen TEXT;
    normalized_destino TEXT;
BEGIN
    -- Normalizar Origen
    IF NEW.origen IS NOT NULL THEN
        SELECT nombre_oficial INTO normalized_origen
        FROM public.b41_lugares_canonicos
        WHERE input_text = LOWER(TRIM(NEW.origen));
        
        IF normalized_origen IS NOT NULL THEN
            NEW.origen := normalized_origen;
        ELSE
            -- Si no está en el diccionario, formatear bonito (Title Case)
            NEW.origen := INITCAP(TRIM(NEW.origen));
        END IF;
    END IF;

    -- Normalizar Destino
    IF NEW.destino IS NOT NULL THEN
        SELECT nombre_oficial INTO normalized_destino
        FROM public.b41_lugares_canonicos
        WHERE input_text = LOWER(TRIM(NEW.destino));
        
        IF normalized_destino IS NOT NULL THEN
            NEW.destino := normalized_destino;
        ELSE
            NEW.destino := INITCAP(TRIM(NEW.destino));
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger BEFORE INSERT (Para que se guarde ya limpio)
DROP TRIGGER IF EXISTS before_insert_normalization ON public.b41_interacciones;

CREATE TRIGGER before_insert_normalization
BEFORE INSERT ON public.b41_interacciones
FOR EACH ROW
EXECUTE FUNCTION public.normalize_interaction_locations();
