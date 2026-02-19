export interface NotificationEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  receivedAt: Date;
}
