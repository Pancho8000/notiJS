import { createServer } from "http";
import { app } from "./app";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = createServer(app);

server.listen(port, () => {
  const baseUrl = `http://localhost:${port}`;
  console.log(`Servidor de notificaciones escuchando en ${baseUrl}`);
});
