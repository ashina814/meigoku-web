export type SourceState =
  | "confirmed"
  | "analysis"
  | "trial"
  | "proposal"
  | "unconfirmed";

export type PublishState = "draft" | "review" | "approved" | "hidden";

/**
 * `internal` controls website output only. This public repository must contain
 * only information that is safe to disclose on GitHub, even when it is hidden
 * from the website.
 */
export type Visibility = "public" | "internal";

export interface PublicContentMeta {
  title: string;
  summary: string;
  order: number;
  sourceState: SourceState;
  publishState: PublishState;
  visibility: Visibility;
  /**
   * Public, non-sensitive identifiers for sources that may be published on
   * GitHub. Do not record Discord IDs, names, internal material names or file
   * paths, consultation, moderation, evaluation information, or private URLs.
   */
  publicSourceKeys: string[];
  lastReviewedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  image?: string;
}
