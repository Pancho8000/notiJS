import { promises as fs } from "fs";
import { dirname } from "path";
import { EventRepository } from "./ports/EventRepository";
import { NotificationEvent } from "../types/NotificationEvent";

type PersistedShape = {
  sequence: number;
  events: NotificationEvent[];
};

export class FileEventRepository implements EventRepository {
  private readonly filePath: string;
  private data: PersistedShape = { sequence: 1, events: [] };

  constructor(filePath: string) {
    this.filePath = filePath;
    void this.initialize();
  }

  private async initialize() {
    try {
      const dir = dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as PersistedShape;
      if (parsed && Array.isArray(parsed.events) && typeof parsed.sequence === "number") {
        this.data = parsed;
      }
    } catch {
      await this.flush();
    }
  }

  private async flush() {
    const content = JSON.stringify(this.data, null, 2);
    await fs.writeFile(this.filePath, content, "utf8");
  }

  async save(event: NotificationEvent): Promise<void> {
    this.data.events.push(event);
    await this.flush();
  }

  async findAll(): Promise<NotificationEvent[]> {
    return [...this.data.events];
  }

  nextId(): string {
    const id = this.data.sequence;
    this.data.sequence += 1;
    return String(id);
  }
}
