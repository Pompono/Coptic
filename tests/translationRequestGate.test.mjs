import test from "node:test";
import assert from "node:assert/strict";
import { createTranslationRequestGate } from "../lib/translationRequestGate.mjs";

test("a newer translation request supersedes an older response", () => {
  const gate = createTranslationRequestGate();
  const older = gate.begin();
  const newer = gate.begin();

  assert.equal(gate.isCurrent(older), false);
  assert.equal(gate.isCurrent(newer), true);
});

test("changing translator state invalidates the in-flight request", async () => {
  const gate = createTranslationRequestGate();
  const request = gate.begin();
  let resolveRequest;
  const pendingResponse = new Promise((resolve) => {
    resolveRequest = resolve;
  });
  const acceptedResponse = pendingResponse.then((response) => gate.isCurrent(request) ? response : null);

  gate.invalidate();
  resolveRequest("old translation");

  assert.equal(await acceptedResponse, null);
});
