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

### Final text for the form (50–500 words; due 27 Nov)

Bolo: tell the doctor what's wrong, in your own language.

Who has the problem: patients and their families at busy OPDs, primary health centres, small clinics and
telemedicine calls. They think and speak in Hindi, Tamil, Bengali, Bhojpuri or a mix, while doctors and the forms
work in English. Many are elderly, many are first-time smartphone users, and many can't read small print or type
comfortably in their own script.

Where and how often it hurts: at every visit. In a crowded OPD the doctor gets a few minutes per patient, and much of
it goes on history-taking: since when, how bad, what else. Patients forget half of it under pressure or can't say it
in the doctor's language. Details get lost, and the doctor decides with less than the patient knew. On a telemedicine
call there is often no one to translate. At home, a son or daughter calling for an ageing parent struggles to describe
the problem clearly.

What Bolo does:
- You tap once and speak, in any Indian language or a mix: "Teen din se bukhar hai, aur kamzori bahut hai."
- Bolo asks two or three short follow-up questions out loud in the same language (since when, how bad, anything
  else), then reads back what it understood. You say "haan" to confirm.
- The doctor gets one clear page in English: the main problem, how long, how bad, who it's for, and the patient's
  exact words in their own script.
- Warning signs such as chest pain, trouble breathing, fainting or stroke signs are caught by fixed rules, not AI, in
  English and Hindi. They show "Get care now: call 112" straight away.
- Bolo never diagnoses and never suggests medicines. It only helps the patient be heard.

Why speaking is the main way in: describing how you feel is something everyone already does out loud, in their own
language. Typing symptoms into a form in English, or even in your own script, shuts out exactly the people who most
need care. With voice, a 70-year-old grandmother, a daily-wage worker and a first-time phone user can all use Bolo
with no training. There is nothing to read and nothing to type: you speak, Bolo listens and asks back like a nurse
would, and the doctor finally hears the whole story.

An early version already works at https://bolo-app.web.app in Hindi and Tamil.

## Prompt

The spoken prompt I would give Wispr Flow to build it:

> Build a mobile web app called Bolo. One big microphone button and nothing to type. The patient speaks their
> symptoms in any Indian language. Send the audio to Gemini and get back the language, a transcript, and structured
> fields: symptoms, since when, severity, and anything else they mentioned. Then ask up to three follow-up questions
> out loud in the same language, and read back a summary for the patient to confirm. Check the words against a fixed
> list of emergency warning signs, never the model, and show a red "call 112" card if any match. Finish with a one-page
> English summary for the doctor that keeps the patient's own words. Never diagnose, never suggest medicines.

---

### Final text for the form (80–800 words; due 27 Nov)

Build a mobile-first web app called Bolo, a voice-first intake for Indian clinics. It should work in a phone browser
on a cheap Android device, with no login and no typing anywhere.

Users: patients at OPDs, primary health centres, small clinics and telemedicine calls, and family members speaking for
someone (for example, a son for his 70-year-old mother). Many are elderly or first-time smartphone users. They speak
Hindi, Tamil, Bengali, Marathi, Telugu, Bhojpuri, English, or a mix such as Hinglish. A second user is the doctor, who
reads the final summary.

Screen: one large microphone button at the bottom, a short line of status text ("Tap and speak", "Listening",
"Understanding", "Speaking"), and the conversation shown as chat bubbles. Show each bubble in the speaker's own script,
with a small English line under Bolo's replies. Use big text and high contrast.

Voice flow, step by step:
1. The patient taps the mic and speaks freely, for example "Teen din se bukhar hai aur bahut kamzori hai."
2. Send the recording to Gemini as audio. Do not use a separate speech-to-text step. Ask for JSON with:
   - the language spoken and its BCP-47 code;
   - the exact transcript in the speaker's own script;
   - a faithful English translation;
   - the intake fields: main problem, since when, how bad, other symptoms, who it is for;
   - the next thing to say.
3. Bolo asks ONE short follow-up question at a time, at most three in total, in the patient's language, and only for
   something important that's missing. For example: "Bukhar ke saath aur koi takleef hai, jaise khaansi ya badan dard?"
   Speak it aloud with the phone's text-to-speech in that language.
4. When enough is known, Bolo reads back a short summary in the patient's language and asks: "Kya yeh sahi hai?"
5. If the patient says yes ("haan", "sari", "ho"), show the doctor's page. If they correct something, update that
   field and read back again.
6. The doctor's page, in English:
   - the main problem, since when, how bad, other symptoms, and who it's for;
   - every turn of what the patient actually said, in their own script;
   - any warning signs.

   Add a print/share button.

What it says back: short, calm, simple sentences, the way a kind nurse speaks. Never diagnose, never name a disease
the patient "has", and never suggest a medicine, dose or test. If asked "what do I have?", answer: "Main doctor ko
aapki baat saaf-saaf bataunga; woh aapko batayenge." ("I'll pass this on to the doctor clearly; they will tell you.")

Emergencies by fixed rules, not AI: after every turn, check both the original transcript and the English translation
against a fixed list of warning signs in English, Hindi script and Roman-script Hinglish. The list covers chest pain
("seene mein dard"), trouble breathing ("saans lene mein takleef"), fainting ("behosh"), stroke signs ("munh tedha",
"haath sunn"), vomiting blood ("khoon ki ulti"), seizures ("daura") and thoughts of self-harm. If any match, show a red
"Get care now: call 112" card at once. For self-harm, show Tele-MANAS 14416. Never let the model decide whether
something is an emergency.

Noise, accents and mixed languages:
- Record with echo cancellation and noise suppression on, and convert to 16 kHz mono WAV before sending.
- Clinics are loud. If Gemini says the audio was unclear, or the transcript is empty, say "Maaf kijiye, phir se
  boliye, thoda paas se" ("Sorry, please say it again, a little closer") instead of guessing.
- Never invent a symptom that wasn't heard. Fill a field only from what was said, and leave it empty otherwise.
- Accept any accent and mid-sentence switching (Hindi to English to Bhojpuri). Reply in the language the patient used
  most in that turn, and keep medical words they used in English in English ("BP", "sugar").
- For numbers and durations ("teen din", "do hafte", "since Sunday"), keep the patient's words and add a plain English
  version.
- If the language can't be told apart, reply in simple Hindi and English together.

Privacy: process each recording for that turn only, and never store audio. Keep the summary in the page until the
patient prints or shares it. No analytics.

Include two sample recordings, one Hindi and one Tamil, so the flow can be demoed without a microphone.

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
