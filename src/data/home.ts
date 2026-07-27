export interface HomeSection {
  id: string;
  title: string;
  placeholder: string;
}

export const homeSections: HomeSection[] = [
  { id: "about", title: "冥獄城とは", placeholder: "【公開原稿確認中】" },
  { id: "experience", title: "城で体験できること", placeholder: "【説明文未確定】" },
  { id: "journey", title: "魂の歩み", placeholder: "【承認後に掲載】" },
  { id: "districts", title: "主要区画", placeholder: "【公開原稿確認中】" },
  { id: "first-visit", title: "初めての人へ", placeholder: "【説明文未確定】" }
];
