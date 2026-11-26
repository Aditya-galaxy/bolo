/**
 * Microphone capture for any browser. Browsers record WebM or MP4, which Gemini doesn't accept everywhere, so each
 * recording is decoded and re-encoded as 16 kHz mono WAV (small, and accepted by every Gemini model).
 */
export class Recorder {
  private rec?: MediaRecorder;
  private chunks: Blob[] = [];
  private stream?: MediaStream;

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    this.chunks = [];
    this.rec = new MediaRecorder(this.stream);
    this.rec.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.rec.start();
  }

  async stop(): Promise<Blob> {
    const rec = this.rec;
    if (!rec) throw new Error("Not recording");
    const done = new Promise<void>((res) => (rec.onstop = () => res()));
    rec.stop();
    await done;
    this.stream?.getTracks().forEach((t) => t.stop());
    return toWav(new Blob(this.chunks, { type: rec.mimeType }));
  }
}

/** Any audio blob → 16 kHz mono 16-bit WAV. */
export async function toWav(blob: Blob, rate = 16000): Promise<Blob> {
  const buf = await blob.arrayBuffer();
  const ctx = new OfflineAudioContext(1, 1, rate);
  const decoded = await ctx.decodeAudioData(buf.slice(0));
  const len = Math.ceil(decoded.duration * rate);
  const off = new OfflineAudioContext(1, len, rate);
  const src = off.createBufferSource();
  src.buffer = decoded;
  src.connect(off.destination);
  src.start();
  const pcm = (await off.startRendering()).getChannelData(0);
  const out = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const w = (o: number, s: string) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); out.setUint32(4, 36 + pcm.length * 2, true); w(8, "WAVE"); w(12, "fmt ");
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true); out.setUint32(24, rate, true);
  out.setUint32(28, rate * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true); w(36, "data");
  out.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 0x7fff, true);
  return new Blob([out], { type: "audio/wav" });
}

export async function toBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

/**
 * Speaks a reply in the person's language with the phone's own voices (Android and iOS ship Hindi, Tamil, Bengali,
 * Telugu, Marathi and more). Resolves when speech ends.
 */
export function speak(text: string, lang: string): Promise<void> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window) || !text) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voices = speechSynthesis.getVoices();
    u.voice = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ?? null;
    u.rate = 0.95;
    // Some browsers never fire "end" when they have no voice for the language, so speaking always times out.
    const timer = setTimeout(resolve, Math.max(3000, text.length * 90));
    u.onend = () => { clearTimeout(timer); resolve(); };
    u.onerror = () => { clearTimeout(timer); resolve(); };
    speechSynthesis.speak(u);
  });
}
