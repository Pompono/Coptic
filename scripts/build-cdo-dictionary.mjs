import fs from "fs";
import path from "path";
import unzipper from "unzipper";

const DATA_URL =
  "https://zenodo.org/records/1004929/files/coptic-dictionary-tei.zip?download=1";

const OUT_FILE = "public/coptic_dictionary_combined.json";

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Download failed: " + res.status);
  return Buffer.from(await res.arrayBuffer());
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").trim();
}

function parseEntries(xml) {
  const entries = [];
  const blocks = xml.match(/<entry[\s\S]*?<\/entry>/g) || [];

  for (const block of blocks) {
    const lemmaMatch = block.match(/<orth[^>]*>(.*?)<\/orth>/);
    if (!lemmaMatch) continue;

    const lemma = stripTags(lemmaMatch[1]);

    if (!/[\u2C80-\u2CFF]/.test(lemma)) continue;

    const defs = [];
    const defMatches = block.match(/<def>(.*?)<\/def>/g) || [];

    for (const d of defMatches) {
      defs.push(stripTags(d));
    }

    entries.push({
      lemma,
      gloss: defs,
      source: "Coptic Dictionary Online",
    });
  }

  return entries;
}

async function main() {
  console.log("Downloading TEI dictionary dataset...");

  const zipBuffer = await download(DATA_URL);

  const directory = await unzipper.Open.buffer(zipBuffer);

  const xmlFile = directory.files.find((f) => f.path.endsWith(".xml"));

  const xml = (await xmlFile.buffer()).toString();

  console.log("Parsing entries...");

  const entries = parseEntries(xml);

  fs.mkdirSync("public", { recursive: true });

  fs.writeFileSync(OUT_FILE, JSON.stringify(entries, null, 2));

  console.log("Done.");
  console.log(entries.length + " entries written to " + OUT_FILE);
}

main();