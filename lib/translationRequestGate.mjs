export function createTranslationRequestGate() {
  let currentRequest = 0;

  return {
    begin() {
      currentRequest += 1;
      return currentRequest;
    },
    invalidate() {
      currentRequest += 1;
    },
    isCurrent(request) {
      return request === currentRequest;
    },
  };
}
