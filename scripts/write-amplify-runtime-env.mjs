import { writeFileSync } from "node:fs";

const runtimeKeys = ["COPTIC_API_BASE_URL", "COPTIC_API_KEY"];
const contents = `${runtimeKeys.map((key) => `${key}=${JSON.stringify(process.env[key] ?? "")}`).join("\n")}\n`;

writeFileSync(".env.production", contents, { mode: 0o600 });
