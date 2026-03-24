# Contact Ship - Lead Management & AI Insights

**Contact Ship** es un microservicio desarrollado con **NestJS** diseñado para la gestión inteligente de leads. El sistema sincroniza prospectos automáticamente desde una API externa, los persiste en una base de datos **PostgreSQL (Supabase)** y genera "insights" utilizando **Google Gemini AI**.

---

## 🛠️ Tecnologías Principales

* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Base de Datos:** [PostgreSQL](https://www.supabase.com/)
* **IA:** [Google Gemini API](https://ai.google.dev/) (Modelo 2.5 Flash)
* **Tareas Programadas:** `@nestjs/schedule` (Cron Jobs)
* **Caché/Colas:** Redis

---

## 🧩 Arquitectura del Sistema

El proyecto sigue una estructura modular y escalable:

1.  **Synchronization Module:** Un Cron Job se ejecuta cada 5 minutos, consume la API de `RandomUser` y envía los datos al servicio de leads.
2.  **IA Module:** Un servicio especializado que se comunica mediante HTTP con Gemini para generar resúmenes y próximas acciones basadas en el nombre del lead.
3.  **Leads Module:** Gestiona la persistencia de datos y la lógica de negocio principal.

> **Nota Técnica:** Se implementó un delay de **20 segundos** entre peticiones de IA para respetar el Rate Limit (5 RPM) del Tier Gratuito de Google Gemini, garantizando la estabilidad del sistema sin errores `429`.

---

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/FacundoNSantillan/Contact-Ship.git
cd Contact-Ship
```
### 2. Instalación de Dependencias
Una vez dentro de la carpeta del proyecto, descarga todos los paquetes necesarios de `npm`. Asegúrate de tener una versión estable de **Node.js** (v18 o superior recomendada).
```bash
# Instalar todos los módulos de node
npm install

# (Opcional) Si necesitas actualizar la SDK de Google AI a la última versión
npm install @google/generative-ai@latest
```
### 3. Levantar Infraestructura (Docker)

Antes de configurar las variables de entorno, es necesario levantar los servicios de soporte (Redis y, opcionalmente, PostgreSQL local).

#### 3.1. Iniciar Contenedores
Ejecuta el siguiente comando para descargar y levantar las imágenes en segundo plano:
```bash
docker-compose up -d
```
### 4. Configurar variables de entorno
Copia el archivo de ejemplo proporcionado en la raíz del proyecto:
```bash
cp .env.example .env
```
### 5. Preparación de la Base de Datos (Prisma)
Una vez configurada la `DATABASE_URL` en tu archivo `.env`, debes sincronizar la estructura de datos de tu proyecto con la base de datos real en la nube.

#### 5.1. Sincronizar el Schema con la DB
Ejecuta el siguiente comando para crear las tablas necesarias en **Supabase**:
```bash
npx prisma db push
```
#### 5.2. Generar el cliente de Prisma
Ejecuta el siguiente comando:
```bash
npx prisma generate
```
### 6. Ejecución
Con la base de datos sincronizada y las dependencias instaladas, ya puedes iniciar el servidor de desarrollo.

#### 6.1. Iniciar el Servidor de Desarrollo
Ejecuta el siguiente comando para levantar la aplicación con **Hot-Reload** (el servidor se reiniciará automáticamente ante cualquier cambio en el código):
```bash
npm run start:dev
```
### 7. Documentación Interactiva (Swagger)

El proyecto incluye **Swagger UI**, lo que permite visualizar y probar todos los endpoints del microservicio de forma interactiva sin necesidad de herramientas externas como Postman.

1.  Asegúrate de que el servidor esté corriendo (`npm run start:dev`).
2.  Abre tu navegador y dirígete a:  
    👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

#### ¿Qué puedes hacer en Swagger?
* **🔍 Ver los Esquemas:** Consultar la estructura exacta de los objetos de datos para los *Leads* y los *Insights* generados por la IA.
* **🔄 Probar la Sincronización:** Ejecutar manualmente el `POST /synchronization/sync` para disparar la carga de datos desde la API externa.
* **📊 Consultar los Leads:** Realizar un `GET /leads` para verificar los resúmenes y próximas acciones generadas automáticamente por **Gemini AI**.
