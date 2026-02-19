import { Router } from "express";
import { NotificationService } from "../services/NotificationService";
import { InMemoryEventRepository } from "../services/InMemoryEventRepository";
import { ConsoleNotifier } from "../services/ConsoleNotifier";
import { FileEventRepository } from "../services/FileEventRepository";
import { MultiNotifier } from "../services/MultiNotifier";
import { EmailSimulatedNotifier } from "../services/EmailSimulatedNotifier";
import { getConfig } from "../config";

const router = Router();

const cfg = getConfig();

const eventRepository =
  cfg.eventStore === "file"
    ? new FileEventRepository(cfg.eventFilePath)
    : new InMemoryEventRepository();

const baseNotifier = new ConsoleNotifier();
const notifier =
  cfg.emailEnabled
    ? new MultiNotifier([baseNotifier, new EmailSimulatedNotifier(cfg.emailTo)])
    : baseNotifier;

const notificationService = new NotificationService(eventRepository, notifier);

router.post("/events", async (req, res) => {
  const { type, payload } = req.body;

  if (!type) {
    return res.status(400).json({ error: "El campo type es obligatorio" });
  }

  try {
    const event = await notificationService.handleEvent({
      type,
      payload: payload ?? {}
    });

    return res.status(201).json({ id: event.id });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo procesar el evento" });
  }
});

router.get("/events", async (_req, res) => {
  const events = await notificationService.listEvents();
  res.json(events);
});

export { router as notificationRouter };
