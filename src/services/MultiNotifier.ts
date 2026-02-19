import { Notifier } from "./ports/Notifier";
import { NotificationEvent } from "../types/NotificationEvent";

export class MultiNotifier implements Notifier {
  private readonly notifiers: Notifier[];
  constructor(notifiers: Notifier[]) {
    this.notifiers = notifiers;
  }
  async notify(event: NotificationEvent): Promise<void> {
    for (const n of this.notifiers) {
      await n.notify(event);
    }
  }
}
