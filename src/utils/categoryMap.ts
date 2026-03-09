import type { TranslationKey } from "@/i18n/translations";

/** Maps Korean DB category keys → i18n translation keys */
export const CAT_LABEL_KEY: Record<string, TranslationKey> = {
  주거안전: "cat.housing",
  귀가안전: "cat.commute",
  생활지원: "cat.living",
  건강: "cat.health",
  커뮤니티: "cat.community",
};
