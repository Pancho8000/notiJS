import { NotificationEvent } from "../types/NotificationEvent";
import { EventRepository } from "./ports/EventRepository";
import { Notifier } from "./ports/Notifier";

export class NotificationService {
  private readonly eventRepository: EventRepository;
  private readonly notifier: Notifier;

  constructor(eventRepository: EventRepository, notifier: Notifier) {
    this.eventRepository = eventRepository;
    this.notifier = notifier;
  }

  async handleEvent(input: Omit<NotificationEvent, "id" | "receivedAt">) {
    const event: NotificationEvent = {
      id: this.eventRepository.nextId(),
      type: input.type,
      payload: input.payload,
      receivedAt: new Date()
    };

    await this.eventRepository.save(event);
    await this.notifier.notify(event);

    return event;
  }

  async listEvents() {
    return this.eventRepository.findAll();
  }
}
