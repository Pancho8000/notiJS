import { NotificationEvent } from "../../types/NotificationEvent";

export interface EventRepository {
  save(event: NotificationEvent): Promise<void>;
  findAll(): Promise<NotificationEvent[]>;
  nextId(): string;
}
