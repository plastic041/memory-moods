// 5 moods from "-2" to "2" with emojis
export const OPTIONS = [
  {
    label: "😭",
    value: "-2",
  },
  {
    label: "😔",
    value: "-1",
  },
  {
    label: "😐",
    value: "0",
  },
  {
    label: "🙂",
    value: "1",
  },
  {
    label: "😄",
    value: "2",
  },
] as const;

export const MOODS = OPTIONS.map((option) => option.value);
