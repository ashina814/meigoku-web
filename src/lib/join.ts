import { joinConfig } from "../data/join";

const weekdayNames = ["日", "月", "火", "水", "木", "金", "土"];

const tokyoParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: joinConfig.timeZone,
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

export const nextSessionLabel = (now = new Date()) => {
  if (joinConfig.recruitmentState !== "open") return null;
  const current = tokyoParts(now);
  const times = joinConfig.sessionTimes.map((time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3)));
  const nowMinutes = current.hour * 60 + current.minute;
  for (let offset = 0; offset < 8; offset += 1) {
    const day = new Date(Date.UTC(current.year, current.month - 1, current.day + offset));
    const weekday = day.getUTCDay();
    if (joinConfig.closedWeekdays.includes(weekday)) continue;
    const nextTime = times.find((time) => offset > 0 || time > nowMinutes);
    if (nextTime === undefined) continue;
    const dateLabel = offset === 0 ? "本日" : `${day.getUTCMonth() + 1}月${day.getUTCDate()}日（${weekdayNames[weekday]}）`;
    return `${dateLabel} ${String(Math.floor(nextTime / 60)).padStart(2, "0")}:${String(nextTime % 60).padStart(2, "0")} JST`;
  }
  return null;
};
