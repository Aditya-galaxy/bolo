import { redFlags as englishFlags, type RedFlag } from "./symptoms.ts";

/**
 * Emergency warning signs, by fixed rules and never by the model. The English rules (from Plainly) run on the English
 * rendering; these run on the speaker's own words, in Hindi script and in Roman-script Hinglish, so a warning sign
 * is caught even if the translation softens it.
 */
const CALL = "Call 112 (emergency) or go to the nearest emergency department now.";
const NATIVE: { id: string; label: string; re: RegExp }[] = [
  { id: "chest", label: "Chest pain or pressure", re: /(सीने|छाती|seene|seena|chhati|chaati)\s*(में|me|mein)?\s*(दर्द|dard|jakdan|जकड़न|dabav|दबाव)/i },
  { id: "breath", label: "Trouble breathing", re: /(साँस|सांस|saans|sans)\s*(लेने\s*में|lene\s*(me|mein))?\s*(नहीं|nahi|nahin|तकलीफ|takleef|dikkat|दिक्कत|phool|फूल)/i },
  { id: "faint", label: "Fainting or passing out", re: /(बेहोश|behosh|chakkar\s*kha\s*ke\s*gir|चक्कर\s*खाकर\s*गिर)/i },
  { id: "stroke", label: "Signs of a stroke (face, arm, speech)", re: /(मुँह|मुंह|muh|munh)\s*(टेढ़ा|tedha)|(हाथ|haath|पैर|pair)\s*(सुन्न|sunn|कमज़ोर|kamzor)|(बोलने\s*में|bolne\s*(me|mein))\s*(दिक्कत|dikkat|तकलीफ|takleef)/i },
  { id: "bleed", label: "Heavy bleeding, or vomiting or coughing blood", re: /(खून|khoon|khun)\s*((की|ki)\s*)?(उल्टी|ulti|aa\s*raha|आ\s*रहा|बह|beh)/i },
  { id: "seizure", label: "A seizure or fit", re: /(दौरा|daura|mirgi|मिर्गी)/i },
  { id: "selfharm", label: "Thoughts of harming yourself", re: /(जीना\s*नहीं|jeena\s*nahi|मर\s*जाना|mar\s*jaana|khudkushi|ख़ुदकुशी|खुदकुशी|suicide)/i },
];

export function warningSigns(transcript: string, english: string): RedFlag[] {
  const found = new Map<string, RedFlag>();
  for (const f of englishFlags(english)) found.set(f.id, f);
  for (const n of NATIVE) if (n.re.test(transcript) && !found.has(n.id))
    found.set(n.id, { id: n.id, label: n.label, advice: n.id === "selfharm"
      ? "You don't have to face this alone. Call Tele-MANAS on 14416 (free, 24×7) or 112 in an emergency."
      : CALL });
  return [...found.values()];
}
