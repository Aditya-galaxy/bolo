import { useRef, useState } from "react";
import { Recorder, speak, toBase64, toWav } from "./lib/audio.ts";
import { warningSigns } from "./lib/flags.ts";
import type { RedFlag } from "./lib/symptoms.ts";
import { understand, type Turn } from "./lib/understand.ts";
import { intake as task } from "./task.ts";

type Phase = "idle" | "listening" | "thinking" | "speaking";

// Fictional sample answers (made with Google Cloud TTS) so the loop can be tried without a microphone.
const SAMPLES = [
  { label: "Hindi sample", files: ["/samples/hi-1.wav", "/samples/hi-2.wav", "/samples/hi-3.wav"] },
  { label: "Tamil sample", files: ["/samples/ta-1.wav"] },
];

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [flags, setFlags] = useState<RedFlag[]>([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const rec = useRef(new Recorder());
  const asked = turns.filter((t) => !t.readyToConfirm).length - (turns.length ? 1 : 0);

  async function handle(wav: Blob) {
    setPhase("thinking");
    try {
      const t = await understand(task, await toBase64(wav), turns, Math.max(0, asked));
      const next = [...turns, t];
      setTurns(next);
      const f = new Map(flags.map((x) => [x.id, x]));
      for (const x of warningSigns(t.transcript, t.english)) f.set(x.id, x);
      setFlags([...f.values()]);
      if (t.confirmed) { setDone(true); setPhase("idle"); return; }
      setPhase("speaking");
      await speak(t.reply, t.languageCode || "hi-IN");
      setPhase("idle");
    } catch (e) {
      setError(`Sorry, that didn't work: ${(e as Error).message}`);
      setPhase("idle");
    }
  }

  async function tapMic() {
    setError("");
    if (phase === "listening") return handle(await rec.current.stop());
    if (phase !== "idle") return;
    try { await rec.current.start(); setPhase("listening"); }
    catch { setError("Allow the microphone to speak to Bolo."); }
  }

  async function playSample(files: string[]) {
    setError("");
    const [file, ...rest] = files;
    setQueue(rest);
    const blob = await (await fetch(file)).blob();
    await handle(await toWav(blob));
  }

  function reset() { setTurns([]); setFlags([]); setDone(false); setError(""); setQueue([]); speechSynthesis.cancel(); }

  const last = turns[turns.length - 1];
  const fields = last?.fields ?? {};

  return (
    <div className="app">
      <header>
        <span className="mark" aria-hidden="true">◉</span> {task.name}
        {turns.length > 0 && <button className="link" onClick={reset}>Start over</button>}
      </header>

      {flags.length > 0 && (
        <section className="alert" role="alert">
          <strong>Get care now</strong>
          {flags.map((f) => <p key={f.id}><b>{f.label}.</b> {f.advice}</p>)}
        </section>
      )}

      {!turns.length && !done && (
        <section className="hero">
          <h1>{task.tagline}</h1>
          <p>Speak in Hindi, Tamil, Bengali, English or any mix. Bolo asks a few questions, then gives your doctor one clear page.</p>
        </section>
      )}

      {!done && (
        <ol className="talk" aria-live="polite">
          {turns.map((t, i) => (
            <li key={i}>
              <p className="you"><span className="lang">{t.language}</span>{t.transcript}</p>
              <p className="bolo">{t.reply}<span className="en">{t.replyEnglish}</span></p>
            </li>
          ))}
        </ol>
      )}

      {done && (
        <section className="summary">
          <h2>{task.summaryTitle}</h2>
          <dl>
            {task.fields.filter((f) => fields[f.key]).map((f) => (
              <div key={f.key}><dt>{f.label}</dt><dd>{fields[f.key]}</dd></div>
            ))}
          </dl>
          <h3>In the patient's words ({last?.language})</h3>
          <ul className="quotes">{turns.map((t, i) => <li key={i}>{t.transcript}</li>)}</ul>
          {flags.length > 0 && <p className="flagnote">Warning signs: {flags.map((f) => f.label).join("; ")}.</p>}
          <p className="note">Recorded with Bolo. Bolo collects symptoms and never diagnoses or suggests medicines.</p>
          <button className="primary" onClick={() => window.print()}>Print or share</button>
        </section>
      )}

      {!done && (
        <footer>
          <button className={`mic ${phase}`} onClick={tapMic} disabled={phase === "thinking" || phase === "speaking"}
            aria-label={phase === "listening" ? "Stop and send" : "Tap to speak"}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" /></svg>
          </button>
          <p className="state">{phase === "listening" ? "Listening… tap when you're done" : phase === "thinking" ? "Understanding…"
            : phase === "speaking" ? "Speaking…" : turns.length ? "Tap to answer" : "Tap and speak"}</p>
          {error && <p className="error">{error}</p>}
          {!turns.length && (
            <p className="samples">{SAMPLES.map((s) => <button key={s.label} className="link" onClick={() => playSample(s.files)} disabled={phase !== "idle"}>{s.label}</button>)}</p>
          )}
          {turns.length > 0 && queue.length > 0 && (
            <p className="samples"><button className="link" onClick={() => playSample(queue)} disabled={phase !== "idle"}>Play the sample's next answer</button></p>
          )}
        </footer>
      )}
    </div>
  );
}
