import { AgentPlatformBackend, getAI, getGenerativeModel, Schema, type GenerativeModel } from "firebase/ai";
import type { Task } from "../task.ts";
import { firebase } from "./firebase.ts";

/** One spoken turn, understood: what was said (in the speaker's script), what it means, and what to say back. */
export type Turn = {
  language: string; // "Hindi", "Tamil", "Hinglish"…
  languageCode: string; // BCP-47 for speaking back, e.g. "hi-IN"
  transcript: string; // exactly what was said, in the speaker's own script
  english: string; // a faithful English rendering
  fields: Record<string, string>; // the task's fields, in English, filled so far
  reply: string; // what to say back, in the speaker's language
  replyEnglish: string;
  unclear: boolean; // the audio was too noisy, too quiet or empty to understand
  readyToConfirm: boolean; // reply is a read-back asking the speaker to confirm
  confirmed: boolean; // the speaker said yes to a read-back
};

let model: GenerativeModel | undefined;
const MODEL = "gemini-3.5-flash";

function schema(task: Task) {
  return Schema.object({
    properties: {
      language: Schema.string({ description: "The language spoken, e.g. Hindi, Tamil, Hinglish" }),
      languageCode: Schema.string({ description: "BCP-47 code for replying in that language, e.g. hi-IN, ta-IN, en-IN" }),
      transcript: Schema.string({ description: "Exactly what the speaker said in this turn, in their own script" }),
      english: Schema.string({ description: "A faithful English translation of this turn" }),
      fields: Schema.object({
        properties: Object.fromEntries(task.fields.map((f) => [f.key, Schema.string({ description: f.description })])),
        optionalProperties: task.fields.map((f) => f.key),
      }),
      reply: Schema.string({ description: "What to say back now, in the speaker's language and script; short and simple" }),
      replyEnglish: Schema.string({ description: "The reply in English" }),
      unclear: Schema.boolean({ description: "True if the recording was too noisy, too quiet, cut off or empty to understand with confidence. Then leave fields unchanged and do not guess." }),
      readyToConfirm: Schema.boolean({ description: "True when the reply reads back a summary and asks the speaker to confirm" }),
      confirmed: Schema.boolean({ description: "True only if the speaker clearly agreed to the previous read-back" }),
    },
  });
}

function getModel(task: Task): GenerativeModel {
  if (model) return model;
  const ai = getAI(firebase(), { backend: new AgentPlatformBackend("global") });
  model = getGenerativeModel(ai, {
    model: MODEL,
    systemInstruction: task.instructions,
    generationConfig: { responseMimeType: "application/json", responseSchema: schema(task) },
  });
  return model;
}

/**
 * Sends one recording plus the conversation so far. Gemini hears the audio directly, so any Indian language (or a
 * mix of them) works without a separate speech-to-text step.
 */
export async function understand(task: Task, wavBase64: string, history: Turn[], questionsAsked: number): Promise<Turn> {
  const so = history.map((t, i) => `Turn ${i + 1}. Speaker (${t.language}): ${t.english}\nYou said: ${t.replyEnglish}`).join("\n");
  const known = history.length ? JSON.stringify(history[history.length - 1].fields) : "{}";
  const budget = questionsAsked >= task.maxQuestions
    ? "You have asked enough questions: do not ask another; read back the summary and ask them to confirm."
    : `You may ask at most ${task.maxQuestions - questionsAsked} more follow-up question(s).`;
  const prompt =
    `Conversation so far:\n${so || "(none: this is the first thing they said)"}\n\nFields filled so far: ${known}\n${budget}\n` +
    "Listen to the new recording, update every field you can (keep earlier values unless corrected), and decide what to say back.";
  // A request that never answers (a network drop, an App Check hiccup) must not leave the screen on "Understanding".
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("no answer in time, please try again")), 40000));
  const res = await Promise.race([getModel(task).generateContent([
    { type: "text", text: prompt },
    { type: "inlineData", inlineData: { mimeType: "audio/wav", data: wavBase64 } },
  ]), timeout]);
  const t = JSON.parse(res.response.text()) as Turn;
  t.fields = { ...(history[history.length - 1]?.fields ?? {}), ...Object.fromEntries(Object.entries(t.fields ?? {}).filter(([, v]) => v && v.trim())) };
  return t;
}
