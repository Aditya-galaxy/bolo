# India Runs on Voice (Scaler × Wispr Flow): entry plan

Official page: https://hackos.scaler.com/wispr/ (read 25 Nov 2026).

## Facts from the page
- **Who:** students and working professionals in India, 18+. Solo or a team of up to 3. Free.
  - Teams lock once anything is submitted, including the Round 1 idea.
- **Theme:** voice-first tools for India, in any Indian language, "built hands-free with Wispr Flow".
- **Tracks:** civic services, healthcare (e.g. symptom intake in regional languages), education, small business (e.g.
  voice bookkeeping), everyday access (e.g. hands-free apps for older users).
- **Round 1 (online warm-up):** Idea (opened 5 Nov), Prompt (13 Nov), Impact (20 Nov). **Closes 26 Nov.** Gives 1 month
  of Flow Pro. The page doesn't say whether it is required for Round 2.
- **Round 2 (online build):**
  - **27 Nov:** one problem statement for everyone goes live.
  - **29 Nov:** submit the build.
  - **2 Dec:** shortlist announced. Includes an online master class with Wispr.
- **Round 3 (finale):** **13 Dec**, in person at Scaler's Bengaluru campus; demo to Wispr leadership, founders and
  investors.
- **Prizes:** ₹30 L across 15 teams.
  - ₹7 L / ₹5 L / ₹3 L for the top three; ₹1.25 L each for 4th–15th.
  - Also 12 months of Flow Pro, a Singapore trip, and an interview at Wispr.
- **Registration:** closes **27 Nov 2026, 11:59 pm IST**. The user registers on the site; Claude never creates the
  account.
- **Judging:** each round's criteria are published when that round opens.
- **Tools:** any editor and AI tools are allowed. Wispr Flow types wherever the cursor is.

## Approach
The problem statement is unknown until 27 Nov, and the build window is about 48 hours. So we prepare a **voice-first
starter** now and spend the 48 hours on the problem itself.

- **Voice in:** the browser mic, any Indian language or a mix (Hinglish). Gemini takes audio input directly and returns
  the transcript, the language and structured fields.
- **Voice out:** spoken read-back in the same language, using Google Cloud TTS Chirp 3 HD voices for Indian locales.
- **Confirm before acting:** read back what was understood, then act on a spoken "haan / yes".
- **Works on a cheap Android phone in a browser:** a PWA with big buttons and no typing anywhere.
- **Healthcare head start from Plainly:**
  - fixed red-flag rules;
  - a doctor summary;
  - no diagnosis.

## Our own dates
- **26 Nov:** user registers, and does the Round 1 warm-up if it's still open. Starter built and tested.
- **27 Nov:** read the problem statement and pick the slice.
- **27–29 Nov:** build, with a demo video if asked. Submit 29 Nov.
- **13 Dec:** user at the Bengaluru finale if shortlisted.
