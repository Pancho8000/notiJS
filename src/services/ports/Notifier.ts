import { NotificationEvent } from "../../types/NotificationEvent";

export interface Notifier {
  notify(event: NotificationEvent): Promise<void>;
}
