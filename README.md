# Follow Hub B.4.1 - Motor de Negociación

Dashboard analítico en tiempo real para el motor de negociación de transporte, construido con Next.js 16 y Supabase.

## 🚀 Características

- **Datos en Tiempo Real**: Actualizaciones automáticas vía Supabase Realtime
- **Métricas en Vivo**: KPIs actualizados desde base de datos real
- **Diseño Profesional**: UI moderna con diseño enterprise-grade
- **Server Components**: Carga rápida con Next.js App Router
- **TypeScript**: Código 100% tipado y seguro

## 📊 Métricas del Dashboard

El dashboard muestra:
- Interacciones totales del día
- Sesiones activas (últimas 24h)
- Reservas confirmadas
- Tasa de conversión
- Valor total negociado
- Health Score de IA
- Top 5 rutas por valor

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Base de Datos**: Supabase (PostgreSQL)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Real-time**: Supabase Realtime Subscriptions
- **Analytics**: Vercel Analytics

## 📋 Pre-requisitos

- Node.js 18+
- Cuenta de Supabase con proyecto configurado
- Base de datos con tablas:
  - `b41_interacciones`
  - `b41_ofertas`
  - `b41_metricas_diarias`
  - `b41_rutas_stats`

## 🚀 Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Obtén estas credenciales desde:
- Supabase Dashboard → Settings → API

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`

## 🗄️ Estructura de Base de Datos

### Tabla: b41_metricas_diarias
```sql
- fecha (date)
- total_mensajes (integer)
- total_sesiones (integer)
- total_interacciones (integer)
- total_consultas (integer)
- total_ofertas_enviadas (integer)
- total_reservas (integer)
- total_rechazos (integer)
- tasa_conversion (numeric)
- valor_total (numeric)
- tasa_exito_ia (numeric)
```

### Tabla: b41_interacciones
```sql
- id (uuid)
- session_id (text)
- created_at (timestamp)
- mensaje_usuario (text)
- respuesta_ia (text)
```

### Tabla: b41_ofertas
```sql
- id (uuid)
- nro_carga (text)
- origen (text)
- destino (text)
- valor_original (numeric)
- valor_final (numeric)
- estado (text)
- created_at (timestamp)
```

### Tabla: b41_rutas_stats
```sql
- id (uuid)
- origen (text)
- destino (text)
- total_consultas (integer)
- total_reservas (integer)
- valor_promedio (numeric)
- valor_total (numeric)
- tasa_conversion (numeric)
```

## 🔄 Actualizaciones en Tiempo Real

El dashboard se actualiza automáticamente cuando:
- Se inserta una nueva interacción en `b41_interacciones`
- Se modifica una oferta en `b41_ofertas`
- Se actualizan las métricas en `b41_metricas_diarias`

Esto se logra mediante Supabase Realtime Subscriptions configuradas en `components/realtime-provider.tsx`.

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Despliega automáticamente

### Variables de entorno en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📱 Integración con n8n

Tu workflow de n8n debe escribir datos a Supabase en las tablas mencionadas. El dashboard los leerá automáticamente y se actualizará en tiempo real.

### Ejemplo de inserción desde n8n:

**Insertar interacción:**
```json
{
  "session_id": "session-123",
  "mensaje_usuario": "Necesito transportar carga a Mendoza",
  "respuesta_ia": "Claro, puedo ayudarte con eso..."
}
```

**Insertar oferta:**
```json
{
  "nro_carga": "CARGA-001",
  "origen": "Buenos Aires",
  "destino": "Mendoza",
  "valor_original": 85000,
  "estado": "ENVIADA"
}
```

## 🔒 Seguridad

- Row Level Security (RLS) debe estar configurado en Supabase
- Las queries usan el cliente server-side para máxima seguridad
- Solo se exponen datos vía Server Components

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm start` - Inicia servidor de producción
- `npm run lint` - Ejecuta linter

## 🤝 Soporte

Para problemas o preguntas:
1. Verifica que las variables de entorno estén correctas
2. Confirma que las tablas existen en Supabase
3. Revisa que n8n esté escribiendo datos correctamente

## 📄 Licencia

Proyecto privado - Follow Hub © 2026
