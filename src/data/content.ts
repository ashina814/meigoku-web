export type SourceState =
  | "confirmed"
  | "analysis"
  | "trial"
  | "proposal"
  | "unconfirmed";

export type PublishState = "draft" | "review" | "approved" | "hidden";

export type Visibility = "public" | "internal";

export interface PublicContentMeta {
  title: string;
  summary: string;
  order: number;
  sourceState: SourceState;
  publishState: PublishState;
  visibility: Visibility;
  sourceRefs: string[];
  lastReviewedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  image?: string;
}
