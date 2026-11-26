import { test } from "node:test";
import assert from "node:assert/strict";
import { warningSigns } from "../src/lib/flags.ts";

const ids = (t: string, e = "") => warningSigns(t, e).map((f) => f.id).sort();

test("warning signs are caught from the speaker's own Hindi or Hinglish, not only the translation", () => {
  assert.deepEqual(ids("teen din se bukhar hai aur seene mein dard ho raha hai"), ["chest"]);
  assert.deepEqual(ids("मुझे सीने में दर्द है"), ["chest"]);
  assert.deepEqual(ids("saans lene mein takleef hai"), ["breath"]);
  assert.deepEqual(ids("kal behosh ho gayi thi"), ["faint"]);
  assert.deepEqual(ids("khoon ki ulti hui"), ["bleed"]);
  assert.deepEqual(ids("jeena nahi chahta"), ["selfharm"]);
});

test("ordinary complaints raise nothing", () => {
  assert.deepEqual(ids("do din se sardi zukam hai, thoda sar dard", "cold for two days and a mild headache"), []);
  assert.deepEqual(ids("pet mein halka dard", "mild stomach ache"), []);
});

test("the English rules still run on the translation, without duplicates", () => {
  assert.deepEqual(ids("seene mein dard", "chest pain since morning"), ["chest"]);
  assert.deepEqual(ids("நெஞ்சு வலி", "chest pain"), ["chest"]);
});
