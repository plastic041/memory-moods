// 5 moods from "-2" to "2" with emojis
export const OPTIONS = [
  {
    label: "😭",
    value: "mood_negative_2",
  },
  {
    label: "😔",
    value: "mood_negative_1",
  },
  {
    label: "😐",
    value: "mood_neutral",
  },
  {
    label: "🙂",
    value: "mood_positive_1",
  },
  {
    label: "😄",
    value: "mood_positive_2",
  },
] as const;

export const MOODS = OPTIONS.map((option) => option.value);

export type Mood = (typeof MOODS)[number];
