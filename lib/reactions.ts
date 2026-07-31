import { Reaction } from "@/lib/types";

export const REACTION_META: Record<Reaction, { emoji: string; label: string }> = {
  heart: { emoji: "❤️", label: "하트" },
  joy: { emoji: "😄", label: "기쁨" },
  sad: { emoji: "😢", label: "슬픔" },
  thumbs_up: { emoji: "👍", label: "엄지척" },
  thumbs_down: { emoji: "👎", label: "엄지다운" },
};

export function formatDate(sqliteUtcDate: string): string {
  const date = new Date(sqliteUtcDate.replace(" ", "T") + "Z");
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
