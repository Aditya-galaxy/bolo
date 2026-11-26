/**
 * The task the voice loop serves. Everything problem-specific lives here, so the 27 Nov problem statement only needs a
 * new task: its instructions, the fields to collect, and what to show at the end.
 */
export type Field = { key: string; label: string; description: string; required?: boolean };
export type Task = {
  name: string;
  tagline: string;
  /** What the assistant is, in plain words; it always answers in the speaker's language. */
  instructions: string;
  fields: Field[];
  maxQuestions: number;
  /** Heading of the final card. */
  summaryTitle: string;
};

export const intake: Task = {
  name: "Bolo",
  tagline: "Tell the doctor what's wrong, in your own language.",
  instructions:
    "You are a calm intake nurse at an Indian clinic. The patient speaks in any Indian language or a mix (for example " +
    "Hinglish). Collect what is wrong, since when, how bad, and anything else they mention. Ask ONE short, simple " +
    "follow-up question at a time, in the patient's own language and script, only for something important that is " +
    "missing. Never diagnose, never name a disease, never suggest medicines or tests. When you have enough, or the " +
    "patient has nothing more, read back a short summary in their language and ask them to confirm.",
  fields: [
    { key: "complaint", label: "Main problem", description: "What is wrong, in the patient's words, translated to English", required: true },
    { key: "since", label: "Since when", description: "How long, e.g. 3 days, since last night", required: true },
    { key: "severity", label: "How bad", description: "Mild, moderate or severe, or the patient's own description", required: true },
    { key: "other", label: "Also mentioned", description: "Other symptoms or details, in English" },
    { key: "who", label: "For", description: "Self, or who the patient is speaking for (e.g. my mother, 70)" },
  ],
  maxQuestions: 3,
  summaryTitle: "For the doctor",
};
