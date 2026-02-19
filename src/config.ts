export type AppConfig = {
  eventStore: "memory" | "file";
  eventFilePath: string;
  emailEnabled: boolean;
  emailTo: string;
};

export function getConfig(): AppConfig {
  const eventStore = (process.env.EVENT_STORE ?? "file").toLowerCase();
  const eventFilePath =
    process.env.EVENT_FILE_PATH ??
    require("path").join(process.cwd(), "data", "events.json");
  const emailEnabled =
    (process.env.EMAIL_ENABLED ?? "false").toLowerCase() === "true";
  const emailTo = process.env.EMAIL_TO ?? "dev@example.com";

  return {
    eventStore: eventStore === "memory" ? "memory" : "file",
    eventFilePath,
    emailEnabled,
    emailTo
  };
}
