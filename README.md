# Bolo

**Tell the doctor what's wrong, in your own language.**

Bolo ("speak" in Hindi) is a voice-first intake for Indian clinics. A patient, or a family member, taps once and
speaks in Hindi, Tamil, Bengali, English or any mix. Bolo:
- asks a few short questions back, out loud, in the same language;
- reads back what it understood;
- hands the doctor one clear page in English, with the patient's own words.

**Live:** https://bolo-app.web.app. Press **Hindi sample** or **Tamil sample** if you'd rather not use the microphone.
The samples are fictional.

Built for [India Runs on Voice](https://hackos.scaler.com/wispr/) (Scaler × Wispr Flow), healthcare track.

## How it works

1. **Hears the audio directly.** Each recording goes to Gemini through Firebase AI Logic, with App Check enforced.
   Gemini understands any Indian language, or a mix of them, without a separate speech-to-text step. It returns:
   - the language;
   - the exact transcript in the speaker's own script;
   - an English rendering;
   - the intake fields;
   - what to say next.
2. **Asks one question at a time,** at most three, in the patient's language. The phone's own voices speak it.
3. **Catches emergencies with fixed rules, never the model.** Warning signs such as chest pain, trouble breathing,
   fainting, stroke signs, bleeding or seizures are matched in English *and* in Hindi or Hinglish, on the speaker's
   own words. They bring up "Get care now: call 112" ([`src/lib/flags.ts`](src/lib/flags.ts)).
4. **Confirms before finishing.** It reads back a summary, and the patient says "haan" to confirm.
5. **Gives the doctor one page:**
   - the main problem, since when, how bad, and anything else mentioned;
   - who it's for;
   - the patient's exact words;
   - any warning signs.

   Bolo never diagnoses and never suggests medicines.

Everything specific to the intake lives in [`src/task.ts`](src/task.ts): the instructions, the fields and the summary.
Swap that file and the same voice loop serves another job, such as voice bookkeeping or a grievance form.

## Run it

```bash
npm install
cp .env.example .env.local   # Firebase web config + App Check
npm run dev
npm test                     # the warning-sign rules
```

The Firebase project needs AI Logic, using the Agent Platform Gemini API, and App Check with reCAPTCHA Enterprise. For
local development, add a registered App Check debug token as `VITE_APPCHECK_DEBUG_TOKEN`.

## Privacy

- **Recordings:** used only for that turn, and never saved.
- **The summary:** stays in the page until you print or share it.
- **Tracking:** none.

## License

MIT
