import { nextSessionLabel } from "../src/lib/join";

const expectEqual = (actual: string | null, expected: string, label: string) => {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, received ${actual}`);
};

// Sunday 23:30 JST: Monday is closed, so the next session is Tuesday 21:00.
expectEqual(nextSessionLabel(new Date("2026-08-02T14:30:00Z")), "8月4日（火） 21:00 JST", "Sunday after 23:00");
// Wednesday 23:30 JST: Thursday is closed, so the next session is Friday 21:00.
expectEqual(nextSessionLabel(new Date("2026-08-05T14:30:00Z")), "8月7日（金） 21:00 JST", "Wednesday after 23:00");

console.log("Join schedule verification passed.");
