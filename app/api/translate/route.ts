import { createTranslationHandler } from "@/lib/translationProxy.mjs";

export const runtime = "nodejs";

export const POST = createTranslationHandler({ direction: "coptic-en" });
