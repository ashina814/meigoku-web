export interface NavigationItem {
  label: string;
  href: string;
}

export const navigationItems: NavigationItem[] = [
  { label: "トップ", href: "/" },
  { label: "魂の診断", href: "/soul-reading" },
  { label: "冥獄城とは", href: "/world" },
  { label: "身分・階級", href: "/ranks" },
  { label: "入城案内", href: "/join" }
];
