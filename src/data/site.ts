export const siteConfig = {
  name: "冥獄城",
  defaultTitle: "冥獄城",
  defaultDescription: "【公開原稿確認中】",
  defaultOgImage: "/og-default.svg",
  // 本番URLの確定後に設定する。架空のドメインは入れない。
  siteUrl: undefined as URL | undefined,
  // 試作段階の既定値。本番公開の承認時に見直す。
  robots: "noindex, nofollow"
} as const;
