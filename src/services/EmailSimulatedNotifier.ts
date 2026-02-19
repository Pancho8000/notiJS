import { Notifier } from "./ports/Notifier";
import { NotificationEvent } from "../types/NotificationEvent";

export class EmailSimulatedNotifier implements Notifier {
  private readonly to: string;
  constructor(to: string) {
    this.to = to;
  }
  async notify(event: NotificationEvent): Promise<void> {
    const subject = `[notiJS] ${event.type} (#${event.id})`;
    const body = JSON.stringify(event.payload);
    console.log(`[email-sim] to=${this.to} subject="${subject}" body=${body}`);
  }
}
