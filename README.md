# notiJS – Microservicio de notificaciones (Node.js + TypeScript)

Pequeño microservicio de notificaciones escrito en **Node.js** y **TypeScript**.  
Su objetivo es recibir eventos de negocio (por ejemplo, una venta realizada), guardarlos y lanzar una notificación (actualmente vía log en consola).

Está pensado para mostrar:

- Uso de Node.js + TypeScript en backend.
- Una arquitectura por capas/puertos y adaptadores (servicio, repositorio, notificador).
- Un ejemplo sencillo de microservicio que puedas enseñar en tu GitHub.

---

## Arquitectura

Estructura principal:

- `src/server.ts` – Punto de entrada. Crea el servidor HTTP y escucha en el puerto `3000`.
- `src/app.ts` – Configura Express, JSON body parser, endpoint `/health` y monta `/notifications`.
- `src/routes/notificationRoutes.ts` – Define los endpoints HTTP de notificaciones.
- `src/services/NotificationService.ts` – Lógica de negocio para manejar eventos.
- `src/services/ports/EventRepository.ts` – Interfaz (puerto) para el repositorio de eventos.
- `src/services/ports/Notifier.ts` – Interfaz (puerto) para el notificador.
- `src/services/InMemoryEventRepository.ts` – Implementación en memoria del repositorio.
- `src/services/ConsoleNotifier.ts` – Implementación que “envía” notificaciones escribiendo logs.
- `src/types/NotificationEvent.ts` – Tipo que representa un evento de notificación.

Flujo típico:

1. Llega una petición `POST /notifications/events` con un evento de negocio.
2. El `NotificationService` construye un `NotificationEvent` con `id` y `receivedAt`.
3. El evento se guarda en el repositorio (`InMemoryEventRepository`).
4. El notificador (`ConsoleNotifier`) escribe un log con el evento.
5. Opcionalmente se puede consultar todo con `GET /notifications/events`.

La lógica de negocio depende de **interfaces**, no de implementaciones concretas, lo que facilita cambiar el repositorio (por una BD real) o el notificador (por correo, Slack, etc.).

---

## Requisitos

- Node.js **v18+** (probado con v24.13.1).
- npm (se instala junto con Node.js).

Comprueba las versiones:

```bash
node -v
npm -v
npx -v
```

---

## Instalación

Clona el repositorio (o copia los archivos a tu carpeta `C:\xampp\htdocs\notiJS`) y ejecuta:

```bash
cd C:\xampp\htdocs\notiJS
npm install
```

---

## Ejecución

### Modo desarrollo (recomendado)

Lanza el servidor usando TypeScript directamente:

```bash
npm run dev
```

Verás algo similar a:

```text
[INFO] ts-node-dev ver. 2.0.0 (...)
Servidor de notificaciones escuchando en http://localhost:3000
```

### Modo compilado

Compila TypeScript a JavaScript y ejecuta el resultado:

```bash
npm run build
npm start
```

---

## Endpoints

### Healthcheck

- `GET /health`
- Respuesta:

```json
{ "status": "ok" }
```

Sirve para comprobar que el microservicio está vivo.

### Crear evento de notificación

- `POST /notifications/events`
- Cuerpo JSON:

```json
{
  "type": "venta.realizada",
  "payload": {
    "orderId": "123",
    "monto": 99.9
  }
}
```

- Respuesta:

```json
{ "id": "1" }
```

El servidor:

- Guarda el evento en memoria.
- Escribe un log en consola, por ejemplo:

```text
[notificacion] type=venta.realizada id=1 payload={"orderId":"123","monto":99.9}
```

### Listar eventos almacenados

- `GET /notifications/events`
- Respuesta:

```json
[
  {
    "id": "1",
    "type": "venta.realizada",
    "payload": {
      "orderId": "123",
      "monto": 99.9
    },
    "receivedAt": "2026-02-19T10:00:00.000Z"
  }
]
```

Cada petición `POST /notifications/events` añade un nuevo elemento a esta lista (mientras el proceso esté en ejecución).

---

## Ejemplos de uso con distintos tipos de eventos

Suponiendo el servidor corriendo en `http://localhost:3000`:

### 1. Venta realizada

```bash
curl -X POST http://localhost:3000/notifications/events \
  -H "Content-Type: application/json" \
  -d '{ "type": "venta.realizada", "payload": { "orderId": "123", "monto": 99.9 } }'
```

### 2. Usuario registrado

```bash
curl -X POST http://localhost:3000/notifications/events \
  -H "Content-Type: application/json" \
  -d '{ "type": "usuario.registrado", "payload": { "userId": "u-001", "email": "user@example.com" } }'
```

### 3. Error del sistema

```bash
curl -X POST http://localhost:3000/notifications/events \
  -H "Content-Type: application/json" \
  -d '{ "type": "error.sistema", "payload": { "service": "pagos", "message": "Timeout al llamar al proveedor" } }'
```

### Listar todos los eventos

```bash
curl http://localhost:3000/notifications/events
```

---

## Configuración por variables de entorno

El comportamiento del microservicio se puede ajustar sin tocar código usando variables de entorno.

### Almacenamiento de eventos

- `EVENT_STORE`
  - `file` (valor por defecto): guarda los eventos en un archivo JSON.
  - `memory`: guarda los eventos sólo en memoria.
- `EVENT_FILE_PATH`
  - Ruta al archivo JSON donde se persistirán los eventos.
  - Por defecto: `./data/events.json` en el directorio del proyecto.

Ejemplos:

- Usar almacenamiento en archivo (por defecto):

  ```bash
  npm run dev
  ```

- Forzar almacenamiento sólo en memoria (los eventos se pierden al reiniciar):

  ```bash
  # CMD (Windows)
  set EVENT_STORE=memory && npm run dev

  # PowerShell
  $env:EVENT_STORE="memory"; npm run dev
  ```

### Notificador de “correo” simulado

Además del log normal de consola, puedes activar un notificador que simula el envío de correos.

- `EMAIL_ENABLED`
  - `true`: activa el notificador de correo simulado.
  - `false` (valor por defecto): sólo notifica por consola.
- `EMAIL_TO`
  - Dirección de correo destino simulada.
  - Por defecto: `dev@example.com`.

Ejemplos:

- Activar correo simulado con el correo por defecto:

  ```bash
  # CMD
  set EMAIL_ENABLED=true && npm run dev

  # PowerShell
  $env:EMAIL_ENABLED="true"; npm run dev
  ```

- Activar correo simulado con un destinatario concreto:

  ```bash
  # CMD
  set EMAIL_ENABLED=true && set EMAIL_TO=tu@correo.com && npm run dev

  # PowerShell
  $env:EMAIL_ENABLED="true"; $env:EMAIL_TO="tu@correo.com"; npm run dev
  ```

Cuando el correo simulado está activo, cada evento generará un log adicional:

```text
[email-sim] to=tu@correo.com subject="[notiJS] venta.realizada (#1)" body={"orderId":"123","monto":99.9}
```

---

## Cómo extenderlo

Ideas para evolucionar este microservicio y mostrar más cosas en tu GitHub:

- **Persistencia real**  
  Crear una implementación de `EventRepository` que guarde los eventos en una base de datos (MongoDB, PostgreSQL, etc.).

- **Notificador real**  
  Crear una implementación de `Notifier` que envie correos (por ejemplo usando nodemailer) o mensajes a Slack/Discord.

- **Autenticación / autorización**  
  Proteger los endpoints con un API key o JWT si lo expones públicamente.

- **Colas de mensajes**  
  Recibir eventos desde una cola (RabbitMQ, Kafka) en lugar de peticiones HTTP directas.

La separación en capas y el uso de interfaces (`EventRepository`, `Notifier`) hace que estos cambios sean relativamente sencillos sin tocar demasiado la lógica del servicio.

