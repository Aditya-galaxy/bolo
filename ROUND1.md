# Round 1 drafts (warm-up: Idea, Prompt, Impact)

The page names the three activities but not their exact questions. Adjust the length to what each form asks, and
submit only after any teammates have joined, because a team locks on its first submission.

Track: **Healthcare**

---

## Idea

**Name:** Bolo (Hindi for "speak")

**One line:** Tell the doctor what's wrong in your own language, before you even reach the clinic.

**What it does:**
- You say what's wrong, in any Indian language or a mix ("teen din se bukhar hai, aur seene mein dard").
- Bolo asks two or three short follow-up questions out loud (since when, how bad, anything else), the way a nurse would.
- It reads back what it understood in your language, and you say "haan" to confirm.
- Fixed warning-sign rules, not AI, catch emergencies such as chest pain, stroke signs or fainting, and tell you to
  call 112 straight away.
- The doctor gets one clean page in English: the symptoms, how long, how bad, your own words, and any warning signs.
  It doesn't diagnose and doesn't suggest medicines.

**Why voice:** many patients can't fill an English intake form, and many can't type comfortably in their own script
either. Everyone can speak.

---

## Prompt

The spoken prompt I would give Wispr Flow to build it:

> Build a mobile web app called Bolo. One big microphone button and nothing to type. The patient speaks their
> symptoms in any Indian language. Send the audio to Gemini and get back the language, a transcript, and structured
> fields: symptoms, since when, severity, and anything else they mentioned. Then ask up to three follow-up questions
> out loud in the same language, and read back a summary for the patient to confirm. Check the words against a fixed
> list of emergency warning signs, never the model, and show a red "call 112" card if any match. Finish with a one-page
> English summary for the doctor that keeps the patient's own words. Never diagnose, never suggest medicines.

---

## Impact

- **Who:**
  - patients and elders who speak Hindi, Tamil, Bengali or another regional language better than English;
  - first-time smartphone users;
  - people who can't read small print.
- **Where it helps:**
  - **Busy OPDs and PHCs:** the doctor sees a clear summary in seconds instead of spending minutes on history-taking.
  - **Telemedicine:** the patient's own words reach the doctor even when no interpreter is there.
  - **Families:** a caregiver can record for an elderly parent at home.
- **Safety:**
  - Warning signs trigger fixed "get care now" advice.
  - The app never diagnoses or prescribes.
  - The doctor always sees the patient's exact words alongside the summary.
- **Privacy:** recordings are processed for that visit and aren't kept. Only the summary is saved, on the patient's
  own phone.
- **How we'd measure it:**
  - intake time per patient;
  - how often doctors change the summary;
  - how often patients confirm it on the first read-back.
