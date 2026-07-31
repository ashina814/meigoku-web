export type SoulId = "tenka" | "kyomei" | "shinen" | "enka" | "chouritsu" | "yoimi" | "junyu" | "kokumei";

export type CrestPath = { d: string; fill?: boolean; dash?: string; weight?: "frame" | "detail" | "main" };

const ring = (x: number, y: number, r: number) => `M ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} A ${r} ${r} 0 1 1 ${x - r} ${y}`;
const diamond = (x: number, y: number, r: number) => `M ${x} ${y - r} L ${x + r} ${y} L ${x} ${y + r} L ${x - r} ${y} Z`;
const spoke = (degree: number, from: number, to: number) => {
  const point = (radius: number) => {
    const angle = (degree - 90) * Math.PI / 180;
    return [50 + radius * Math.cos(angle), 50 + radius * Math.sin(angle)];
  };
  const a = point(from); const b = point(to);
  return `M ${a[0].toFixed(2)} ${a[1].toFixed(2)} L ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
};

const frame: CrestPath[] = [
  { d: ring(50, 50, 46.5), weight: "detail" },
  { d: diamond(50, 50, 44), weight: "frame" },
  { d: diamond(50, 50, 38), weight: "detail" }
];
const miniFrame: CrestPath[] = [{ d: diamond(50, 50, 44), weight: "frame" }, { d: diamond(50, 6, 3), fill: true }, { d: diamond(50, 94, 3), fill: true }];

const soul = (id: SoulId, name: string, latin: string, line: string, full: CrestPath[], mini: CrestPath[]) => ({ id, name, latin, line, full, mini });

export const soulTypes = [
  soul("tenka", "点火の魂", "TENKA", "火種を置き、場を動かしていく魂。", [
    { d: ring(50, 50, 30), weight: "main" }, { d: ring(50, 50, 14), weight: "detail" }, { d: diamond(50, 50, 6), fill: true },
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((d) => ({ d: spoke(d, d % 45 ? 18 : 17, d % 45 ? 23 : 27), weight: d % 45 ? "detail" as const : "main" as const }))
  ], [{ d: diamond(50, 50, 8), fill: true }, ...[0, 90, 180, 270].map((d) => ({ d: spoke(d, 14, 26) }))]),
  soul("kyomei", "共鳴の魂", "KYOMEI", "誰かの声を受け取り、返していく魂。", [
    { d: ring(50, 50, 30), weight: "main" }, { d: ring(50, 50, 26.5), weight: "detail" }, { d: "M28 26 A40 40 0 0 0 28 74", weight: "detail" }, { d: "M72 26 A40 40 0 0 1 72 74", weight: "detail" },
    { d: "M35 27 A25 25 0 0 1 35 73" }, { d: "M43 33 A19 19 0 0 1 43 67" }, { d: "M51 40 A12 12 0 0 1 51 60" }, { d: ring(62, 50, 3.4), fill: true }
  ], [{ d: "M38 30 A22 22 0 0 1 38 70" }, { d: "M48 38 A14 14 0 0 1 48 62" }, { d: ring(62, 50, 4), fill: true }]),
  soul("shinen", "深縁の魂", "SHIN-EN", "一つの話と、深く長くつながる魂。", [
    { d: "M50 20 A30 30 0 0 1 50 80", weight: "main" }, { d: "M50 20 A30 30 0 0 0 50 80", dash: "22 8", weight: "main" }, { d: diamond(50, 6, 3.4), fill: true }, { d: diamond(50, 94, 3.4), fill: true },
    { d: ring(50, 27, 6) }, { d: ring(50, 45, 9) }, { d: ring(50, 68, 13) }, { d: ring(50, 68, 3), fill: true }
  ], [{ d: ring(50, 30, 7) }, { d: "M50 37 V54" }, { d: ring(50, 66, 13) }]),
  soul("enka", "宴火の魂", "EN-KA", "笑いと反応で、場に熱を灯す魂。", [
    { d: ring(50, 50, 30), dash: "2 4", weight: "main" }, { d: diamond(50, 8, 4), fill: true }, { d: "M24 66 H76" }, { d: "M32 66 L28 52" }, { d: "M40 66 L42 44" }, { d: "M49 66 L46 32" }, { d: "M58 66 L62 43" }, { d: "M67 66 L71 53" }, { d: "M31 72 A21 21 0 0 0 69 72", weight: "detail" }
  ], [{ d: "M27 64 H73" }, { d: "M38 64 L34 46" }, { d: "M50 64 L46 32" }, { d: "M62 64 L67 48" }]),
  soul("chouritsu", "調律の魂", "CHORITSU", "みんなの居場所が整うよう、耳を澄ます魂。", [
    { d: ring(50, 50, 30), weight: "main" }, { d: "M33 26 A34 34 0 0 1 67 26", weight: "detail" }, { d: "M33 74 A34 34 0 0 0 67 74", weight: "detail" }, { d: "M20 50 H80" }, { d: "M20 41 V59" }, { d: "M80 41 V59" }, { d: ring(50, 50, 10) }, { d: diamond(50, 50, 3.4), fill: true }
  ], [{ d: "M22 50 H78" }, { d: "M22 42 V58" }, { d: "M78 42 V58" }, { d: ring(50, 50, 10) }]),
  soul("yoimi", "宵見の魂", "YOIMI", "気配を読み、合う瞬間を見つける魂。", [
    { d: ring(50, 50, 30), weight: "detail" }, { d: "M50 20 A30 30 0 0 0 50 80", weight: "main" }, { d: "M74 28 A38 38 0 0 1 74 72", weight: "detail" }, { d: "M50 25 A25 25 0 1 0 50 75" }, { d: "M50 25 A32 32 0 0 1 50 75" }, { d: ring(66, 50, 3.4), fill: true }, { d: ring(60, 39, 2), fill: true }, { d: ring(60, 61, 2), fill: true }
  ], [{ d: "M50 26 A25 25 0 1 0 50 74" }, { d: "M50 26 A32 32 0 0 1 50 74" }, { d: ring(66, 50, 4), fill: true }]),
  soul("junyu", "巡遊の魂", "JUNYU", "城のあちこちを巡り、接点を広げる魂。", [
    { d: ring(50, 50, 30), dash: "7 6", weight: "main" }, { d: ring(50, 50, 23), dash: "3 5" }, { d: ring(50, 50, 8), weight: "detail" }, ...[0, 90, 180, 270].flatMap((d) => [{ d: spoke(d, 11, 16), weight: "detail" as const }, { d: ring(50 + 23 * Math.cos((d - 90) * Math.PI / 180), 50 + 23 * Math.sin((d - 90) * Math.PI / 180), 3.6), fill: true }])
  ], [{ d: ring(50, 50, 22), dash: "4 6" }, ...[0, 120, 240].map((d) => ({ d: ring(50 + 22 * Math.cos((d - 90) * Math.PI / 180), 50 + 22 * Math.sin((d - 90) * Math.PI / 180), 4.4), fill: true }))]),
  soul("kokumei", "刻名の魂", "KOKUMEI", "好きなものに名を刻み、自分の色を出す魂。", [
    { d: ring(50, 50, 30), weight: "main" }, { d: "M24 24 H76 V76 H24 Z", weight: "detail" }, { d: "M37 37 H63 V63 H37 Z" }, { d: diamond(50, 50, 19) }, { d: "M24 50 H76" }, { d: "M50 24 V76" }, { d: diamond(50, 50, 4.2), fill: true }
  ], [{ d: "M36 36 H64 V64 H36 Z" }, { d: diamond(50, 50, 20) }, { d: diamond(50, 50, 4.5), fill: true }])
] as const;

export const castleCrest: CrestPath[] = [
  { d: ring(50, 50, 46.5), weight: "detail" }, { d: diamond(50, 50, 44), weight: "frame" }, { d: diamond(50, 50, 38), weight: "detail" }, { d: "M50 14 L57 36 H43 Z" }, { d: "M34 23 L40 41 H28 Z" }, { d: "M66 23 L72 41 H60 Z" }, { d: "M26 53 H74" }, { d: "M28 53 V46 H34 V53 M43 53 V44 H47 V53 M53 53 V44 H57 V53 M66 53 V46 H72 V53" }, { d: "M42 78 V64 A11 11 0 0 1 50 53 M58 78 V64 A11 11 0 0 0 50 53" }, { d: "M24 78 H76" }, { d: diamond(50, 68, 3.2), fill: true }
];
export const castleCrestCompact: CrestPath[] = [{ d: diamond(50, 50, 44), weight: "frame" }, { d: "M50 18 L58 42 H42 Z" }, { d: "M40 78 V62 A12 12 0 0 1 50 46 M60 78 V62 A12 12 0 0 0 50 46" }, { d: "M26 78 H74" }, { d: diamond(50, 68, 4), fill: true }];

export const crestPaths = (id: SoulId, simplified = false): CrestPath[] => [...(simplified ? miniFrame : frame), ...(simplified ? soulTypes.find((type) => type.id === id)!.mini : soulTypes.find((type) => type.id === id)!.full)];
export const castleCrestPaths = (simplified = false): CrestPath[] => simplified ? castleCrestCompact : castleCrest;
