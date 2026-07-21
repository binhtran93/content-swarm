export function assertTimeZone(timeZone: string): string {
  const value = timeZone.trim();
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return value;
  } catch {
    throw new Error("Choose a valid IANA timezone.");
  }
}

export function nextScheduledTime(
  after: Date,
  localTime: string,
  timeZone: string,
): Date {
  const [targetHour, targetMinute] = localTime.split(":").map(Number);
  if (
    targetHour === undefined ||
    targetMinute === undefined ||
    targetHour < 0 ||
    targetHour > 23 ||
    targetMinute < 0 ||
    targetMinute > 59
  )
    throw new Error("Choose a valid publication time.");

  const zone = assertTimeZone(timeZone);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const start = new Date(after.getTime() + 60_000);
  start.setUTCSeconds(0, 0);

  for (let offset = 0; offset < 60 * 49; offset += 1) {
    const candidate = new Date(start.getTime() + offset * 60_000);
    const parts = Object.fromEntries(
      formatter
        .formatToParts(candidate)
        .filter((part) => part.type === "hour" || part.type === "minute")
        .map((part) => [part.type, Number(part.value)]),
    );
    if (parts.hour === targetHour && parts.minute === targetMinute)
      return candidate;
  }
  throw new Error("The next publication time could not be calculated.");
}
