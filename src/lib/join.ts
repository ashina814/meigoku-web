import { joinConfig, type JoinConfig } from "../data/join";

const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"] as const;

export const formatSessionTimes = (config: JoinConfig = joinConfig) =>
  config.sessionTimes.length ? `説明会 ${config.sessionTimes.join(" / ")} JST` : null;

export const formatClosedWeekdays = (
  config: JoinConfig = joinConfig,
  format: "short" | "long" = "short"
) => {
  const weekdays = [...new Set(config.closedWeekdays)]
    .filter((weekday) => Number.isInteger(weekday) && weekday >= 0 && weekday <= 6)
    .sort((a, b) => a - b)
    .map((weekday) => `${weekdayNames[weekday]}${format === "long" ? "曜日" : ""}`);

  return weekdays.length ? weekdays.join("・") : null;
};

export const formatReviewedDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${Number(match[1])}年${Number(match[2])}月${Number(match[3])}日` : value;
};

const tokyoParts = (date: Date, config: JoinConfig) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: config.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(value("weekday"));
  return { year: Number(value("year")), month: Number(value("month")), day: Number(value("day")), weekday, hour: Number(value("hour")), minute: Number(value("minute")) };
};

const sessionMinutes = (times: readonly string[]) => {
  const values = times.map((time) => {
    const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(time);
    return match ? Number(match[0].slice(0, 2)) * 60 + Number(match[0].slice(3)) : null;
  });

  return values.includes(null) ? null : [...new Set(values as number[])].sort((a, b) => a - b);
};

export const nextSessionLabel = (now = new Date(), config: JoinConfig = joinConfig) => {
  if (config.recruitmentState !== "open" || Number.isNaN(now.getTime())) return null;
  const times = sessionMinutes(config.sessionTimes);
  if (!times?.length) return null;

  const current = tokyoParts(now, config);
  const nowMinutes = current.hour * 60 + current.minute;
  for (let offset = 0; offset < 8; offset += 1) {
    const day = new Date(Date.UTC(current.year, current.month - 1, current.day + offset));
    const weekday = day.getUTCDay();
    if (config.closedWeekdays.includes(weekday)) continue;
    const nextTime = times.find((time) => offset > 0 || time > nowMinutes);
    if (nextTime === undefined) continue;
    const dateLabel = offset === 0 ? "本日" : `${day.getUTCMonth() + 1}月${day.getUTCDate()}日（${weekdayNames[weekday]}）`;
    return `${dateLabel} ${String(Math.floor(nextTime / 60)).padStart(2, "0")}:${String(nextTime % 60).padStart(2, "0")} JST`;
  }
  return null;
};
