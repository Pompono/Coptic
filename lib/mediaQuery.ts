type MediaQueryChangeHandler = (event: MediaQueryListEvent) => void;

type LegacyMediaQueryList = MediaQueryList & {
  addListener?: (listener: MediaQueryChangeHandler) => void;
  removeListener?: (listener: MediaQueryChangeHandler) => void;
};

export function subscribeToMediaQueryChange(
  mediaQueryList: MediaQueryList,
  onChange: () => void
) {
  const listener: MediaQueryChangeHandler = () => {
    onChange();
  };

  const mediaQueryListWithLegacyApi = mediaQueryList as LegacyMediaQueryList;

  if (typeof mediaQueryListWithLegacyApi.addEventListener === "function") {
    mediaQueryListWithLegacyApi.addEventListener("change", listener);
    return () => mediaQueryListWithLegacyApi.removeEventListener("change", listener);
  }

  if (typeof mediaQueryListWithLegacyApi.addListener === "function") {
    mediaQueryListWithLegacyApi.addListener(listener);
    return () => mediaQueryListWithLegacyApi.removeListener?.(listener);
  }

  return () => {};
}
