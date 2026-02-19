import { EventRepository } from "./ports/EventRepository";
import { NotificationEvent } from "../types/NotificationEvent";

export class InMemoryEventRepository implements EventRepository {
  private readonly events: NotificationEvent[] = [];
  private sequence = 1;

  async save(event: NotificationEvent): Promise<void> {
    this.events.push(event);
  }

  async findAll(): Promise<NotificationEvent[]> {
    return [...this.events];
  }

  nextId(): string {
    const id = this.sequence;
    this.sequence += 1;
    return String(id);
  }
}
