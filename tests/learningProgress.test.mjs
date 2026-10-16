import test from 'node:test';
import assert from 'node:assert/strict';
import { dueLearningItems, learningId, masteryState, parseLearning, recordAttempt } from '../lib/learning/progress.mjs';

const item = { word: 'ⲡⲓⲣⲱⲙⲓ', meaning: 'the person', unitId: 'unit', explanation: 'The article and noun form one phrase.' };
const day = 86400000;

test('only first try successes on separate days advance mastery', () => {
  let data = recordAttempt(parseLearning(null), item, true, true, day);
  for (let attempt = 0; attempt < 8; attempt += 1) data = recordAttempt(data, item, true, false, day + attempt);
  assert.equal(data.skills[learningId(item)].successfulDays, 1);
  assert.equal(masteryState(data.skills[learningId(item)]), 'Building');
  data = recordAttempt(data, item, true, true, day * 2);
  data = recordAttempt(data, item, true, true, day * 3);
  assert.equal(masteryState(data.skills[learningId(item)]), 'Secure');
});

test('mistakes return for review after ten minutes and malformed data is not reset', () => {
  const data = recordAttempt(parseLearning(null), item, false, true, 10000);
  const id = learningId(item);
  assert.equal(data.skills[id].dueAt, 610000);
  assert.equal(dueLearningItems(data, [id], 609999).length, 0);
  assert.equal(dueLearningItems(data, [id], 610000).length, 1);
  assert.throws(() => parseLearning('{broken'));
  assert.throws(() => parseLearning(JSON.stringify({ version: 2, skills: {} })));
});
