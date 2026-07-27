import type { PublicContentMeta } from "../data/content";

/** 公開承認済みかつ外部公開対象のコンテンツだけを通す。 */
export function isPubliclyVisible(
  content: Pick<PublicContentMeta, "publishState" | "visibility">
): boolean {
  return content.publishState === "approved" && content.visibility === "public";
}
