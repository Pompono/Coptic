import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const XML_PATH = path.join(process.cwd(), "scripts", "Comprehensive_Coptic_Lexicon.xml");
const OUT_PATH = path.join(process.cwd(), "public", "coptic_dictionary_combined.json");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Keep text nodes in "#text"
  textNodeName: "#text",
});

function cleanText(x) {
  if (x === null || x === undefined) return "";
  return String(x).replace(/\s+/g, " ").trim();
}

function uniq(arr) {
  return [...new Set(arr.map((s) => cleanText(s)).filter(Boolean))];
}

/**
 * Recursively pull ONLY human-readable text from a node.
 * (Safely handles strings, arrays, objects, nested "#text" nodes)
 */
function extractTextDeep(node) {
  const out = [];

  const push = (v) => {
    const t = cleanText(v);
    if (t) out.push(t);
  };

  const walk = (n) => {
    if (n === null || n === undefined) return;

    if (typeof n === "string" || typeof n === "number" || typeof n === "boolean") {
      push(n);
      return;
    }

    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }

    if (typeof n === "object") {
      if ("#text" in n) push(n["#text"]);
      for (const v of Object.values(n)) walk(v);
    }
  };

  walk(node);
  return out;
}

/**
 * Extract lemma + variants/forms from TEI entry.form/orth.
 */
function getLemmaAndForms(entry) {
  const formsRaw = entry.form
    ? Array.isArray(entry.form)
      ? entry.form
      : [entry.form]
    : [];

  let lemma = null;
  const forms = [];

  for (const f of formsRaw) {
    const orths = f.orth
      ? Array.isArray(f.orth)
        ? f.orth
        : [f.orth]
      : [];

    for (const o of orths) {
      // orth can be a string or an object with "#text"
      const val = typeof o === "string" ? o : o?.["#text"];
      const t = cleanText(val);
      if (t) forms.push(t);
    }

    if (!lemma && f["@_type"] === "lemma" && f.orth) {
      const o = Array.isArray(f.orth) ? f.orth[0] : f.orth;
      const val = typeof o === "string" ? o : o?.["#text"];
      const t = cleanText(val);
      if (t) lemma = t;
    }
  }

  if (!lemma && forms.length) lemma = forms[0];

  return { lemma, forms: uniq(forms) };
}

/**
 * Extract POS if present (often in gramGrp/pos or gram type="pos").
 */
function getPOS(entry) {
  const gg = entry.gramGrp
    ? Array.isArray(entry.gramGrp)
      ? entry.gramGrp
      : [entry.gramGrp]
    : [];

  for (const g of gg) {
    if (g.pos) return cleanText(typeof g.pos === "string" ? g.pos : g.pos?.["#text"]);
    if (g.gram) {
      const grams = Array.isArray(g.gram) ? g.gram : [g.gram];
      for (const gr of grams) {
        if (gr?.["@_type"] === "pos") return cleanText(gr?.["#text"] ?? gr);
      }
    }
  }

  return "";
}

/**
 * Extract gloss/definitions ONLY from meaning sections:
 * - sense
 * - def
 * - gloss
 *
 * Avoids pulling metadata keys like "lemma", "translation", "de/en/fr", refs, etc.
 */
function getGloss(entry) {
  const results = [];

  const senses = entry.sense
    ? Array.isArray(entry.sense)
      ? entry.sense
      : [entry.sense]
    : [];

  // Helper to pull <def> and <gloss> from a sense-like object
  const pullFromSense = (s) => {
    if (!s) return;

    // <def> can be string or object or array
    if (s.def) {
      results.push(...extractTextDeep(s.def));
    }

    // <gloss> can be string or object or array
    if (s.gloss) {
      results.push(...extractTextDeep(s.gloss));
    }

    // Sometimes definitions are nested inside <cit>, <quote>, etc.
    // BUT only within sense (so it stays “meaning-related”).
    if (s.cit) results.push(...extractTextDeep(s.cit));
    if (s.quote) results.push(...extractTextDeep(s.quote));

    // Nested senses
    if (s.sense) {
      const nested = Array.isArray(s.sense) ? s.sense : [s.sense];
      nested.forEach(pullFromSense);
    }
  };

  senses.forEach(pullFromSense);

  // Fallback: if no sense, look for def/gloss directly on entry
  if (results.length === 0) {
    if (entry.def) results.push(...extractTextDeep(entry.def));
    if (entry.gloss) results.push(...extractTextDeep(entry.gloss));
  }

  // Clean + dedupe + remove obvious non-definition noise
  const cleaned = uniq(results).filter((t) => {
    // throw away extremely short tags/labels
    if (t.length <= 1) return false;
    // common label noise
    const bad = new Set([
      "lemma",
      "translation",
      "de",
      "en",
      "fr",
      "geo",
      "s",
    ]);
    if (bad.has(t.toLowerCase())) return false;

    // filter out pure reference codes (e.g., CF38, CS6, C6, etc.)
    if (/^(CF|CS|CD|C)\d+[a-z]?$/.test(t)) return false;

    return true;
  });

  return cleaned
  .filter(x => !/^[A-Z]{1,4}\s*\d/.test(x))  // removes reference codes
  .slice(0, 10);
}

function main() {
  console.log("Reading XML:", XML_PATH);
  const xml = fs.readFileSync(XML_PATH, "utf8");

  console.log("Parsing XML...");
  const data = parser.parse(xml);

  // TEI layouts vary; try common paths
  const body =
    data?.TEI?.text?.body ||
    data?.teiCorpus?.TEI?.[0]?.text?.body ||
    data?.TEI?.text?.["#text"]?.body;

  let entryList = body?.entry;

  // Sometimes entries are inside <div>
  if (!entryList && body?.div?.entry) entryList = body.div.entry;

  const entriesRaw = entryList
    ? Array.isArray(entryList)
      ? entryList
      : [entryList]
    : [];

  const out = [];

  for (const entry of entriesRaw) {
    const { lemma, forms } = getLemmaAndForms(entry);
    if (!lemma) continue;

    // Only keep Unicode Coptic lemmas
    if (!/[\u2C80-\u2CFF]/.test(lemma)) continue;

    const pos = getPOS(entry);
    const gloss = getGloss(entry);

    out.push({
      lemma,
      forms,
      pos,
      gloss,
      hasGloss: gloss.length > 0,
      source: "Comprehensive Coptic Lexicon (Refubium fub188/27813)",
      license: "CC BY-SA 4.0",
    });
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), "utf8");

  const withGloss = out.filter((e) => e.hasGloss).length;
  console.log(`✅ Wrote ${out.length} entries (${withGloss} with gloss) to ${OUT_PATH}`);
}

main();