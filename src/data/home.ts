export const homeAssets = {
  /** Approved server-icon-derived exterior art for the official Hero. */
  castleHero: "/images/brand/meigoku-castle-hero.png"
} as const;

export const homeHero = {
  title: "名もなき魂よ、城門を叩け。",
  lead: "人と出会い、居場所を持ち、やがて誰かに名を呼ばれる存在になる。",
  description:
    "冥獄城は、交流、イベント、役職、創作、Land経済などが世界観と結びついたDiscordコミュニティです。"
} as const;

export const experiences = [
  ["人と出会う", "雑談、VC、交流"],
  ["自分を表す", "日記、作品、声、写真、キャラクター、個人店"],
  ["催しに参加する", "クイズ、ゲーム、季節企画、大型企画"],
  ["城の活動を支える", "イベント、案内、制作、空間運営、技術"],
  ["城の経済に触れる", "Land、商品、個人店、施設、活動報酬"]
] as const;

export const soulStages = ["無名", "出会い", "反応", "居場所", "役割"] as const;

export const soulJourney = [
  ["城門", "サイトと入城案内を読み、城の外から中へ向かう地点。"],
  ["亡霊", "城内の人や文化を知り、自分に合う関わり方を探す段階。"],
  ["魔人", "評価を経て、城の一員として活動や役割へ進める段階。"],
  ["魔族", "さらに評価を経て進む、本メンバーとしての身分。"]
] as const;

export const districts = ["諧和廷", "宿屋", "冥獄回廊", "冥界商館"] as const;
export const districtExtras = ["ゲーム室", "配信区画", "冥獄銀行", "賭博場"] as const;
export const roles = ["案内する者", "催しを作る者", "空間を整える者", "絵や印を作る者", "技術で支える者"] as const;

export const faqs = [
  ["世界観を覚えてから入る必要がありますか？", "世界観を暗記する必要はありません。亡霊として城内を知るところから始まります。"],
  ["いきなり話せる自信がありません。", "通話、文章、イベント、制作など、複数の関わり方があります。"],
  ["入城手続きが不安です。", "入城前に、城の仕組みや過ごし方を知り、疑問を確認するための説明があります。"],
  ["年齢や参加条件はありますか？", "年齢や参加条件は【掲載可否確認中】です。"]
] as const;
