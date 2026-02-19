import { Notifier } from "./ports/Notifier";
import { NotificationEvent } from "../types/NotificationEvent";

export class ConsoleNotifier implements Notifier {
  async notify(event: NotificationEvent): Promise<void> {
    const payload = JSON.stringify(event.payload);
    console.log(`[notificacion] type=${event.type} id=${event.id} payload=${payload}`);
  }
}
