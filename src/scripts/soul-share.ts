import { soulResultTypes } from "../data/soul-results";
import { createSoulResultUrl, createSoulShareText, createSoulShareTitle } from "../lib/soul-share";

type ShareRoot = HTMLElement;

const getResult = (root: ShareRoot) => soulResultTypes.find((result) => result.id === root.dataset.soulId);

const setStatus = (root: ShareRoot, message: string) => {
  const status = root.querySelector<HTMLElement>("[data-soul-share-status]");
  if (status) status.textContent = message;
};

const revealManualCopy = (root: ShareRoot, url: string) => {
  const field = root.querySelector<HTMLElement>("[data-soul-share-manual]");
  const input = field?.querySelector<HTMLInputElement>("input");
  if (field && input) {
    input.value = url;
    field.hidden = false;
    input.focus();
    input.select();
  }
};

export const shareSoulResult = async (root: ShareRoot) => {
  const result = getResult(root);
  if (!result) return;

  const url = createSoulResultUrl(result.id, window.location.origin);
  const title = createSoulShareTitle(result);
  const text = createSoulShareText(result);
  const manual = root.querySelector<HTMLElement>("[data-soul-share-manual]");
  manual?.setAttribute("hidden", "");

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      setStatus(root, "共有画面を開きました");
      return;
    } catch (error) {
      if ((error as { name?: string }).name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    setStatus(root, "結果URLをコピーしました");
  } catch {
    setStatus(root, "自動でコピーできませんでした。下のURLを選択してコピーしてください。");
    revealManualCopy(root, url);
  }
};

export const attachSoulShare = (root: ShareRoot) => {
  root.querySelector<HTMLButtonElement>("[data-soul-share-button]")?.addEventListener("click", () => {
    void shareSoulResult(root);
  });
};
