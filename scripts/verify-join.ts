import { joinConfig, type JoinConfig } from "../src/data/join";
import { nextSessionLabel } from "../src/lib/join";

const expectEqual = (actual: string | null, expected: string | null, label: string) => {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, received ${actual}`);
};

const config = (overrides: Partial<JoinConfig> = {}): JoinConfig => ({ ...joinConfig, ...overrides });

// Tuesday, JST: each regular slot advances once it has started.
expectEqual(nextSessionLabel(new Date("2026-08-04T11:30:00Z")), "本日 21:00 JST", "Before 21:00");
expectEqual(nextSessionLabel(new Date("2026-08-04T12:30:00Z")), "本日 22:00 JST", "Between 21:00 and 22:00");
expectEqual(nextSessionLabel(new Date("2026-08-04T13:30:00Z")), "本日 23:00 JST", "Between 22:00 and 23:00");
expectEqual(nextSessionLabel(new Date("2026-08-04T14:30:00Z")), "8月5日（水） 21:00 JST", "After 23:00");
// Monday and Thursday are closed.
expectEqual(nextSessionLabel(new Date("2026-08-03T11:00:00Z")), "8月4日（火） 21:00 JST", "Monday");
expectEqual(nextSessionLabel(new Date("2026-08-06T11:00:00Z")), "8月7日（金） 21:00 JST", "Thursday");
// Sunday 23:30 JST: Monday is closed, so the next session is Tuesday 21:00.
expectEqual(nextSessionLabel(new Date("2026-08-02T14:30:00Z")), "8月4日（火） 21:00 JST", "Sunday after 23:00");
// Wednesday 23:30 JST: Thursday is closed, so the next session is Friday 21:00.
expectEqual(nextSessionLabel(new Date("2026-08-05T14:30:00Z")), "8月7日（金） 21:00 JST", "Wednesday after 23:00");
expectEqual(nextSessionLabel(new Date("2026-08-04T11:30:00Z"), config({ recruitmentState: "limited" })), null, "Non-open recruitment state");
expectEqual(nextSessionLabel(new Date("2026-08-04T11:30:00Z"), config({ sessionTimes: [] })), null, "Empty session times");
expectEqual(nextSessionLabel(new Date("2026-08-04T11:30:00Z"), config({ sessionTimes: ["21:00", "invalid"] })), null, "Invalid session time");

console.log("Join schedule verification passed.");
