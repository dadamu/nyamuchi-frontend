import React from "react";
export function getPageStateFromUrlHash(): any {
  if (typeof window === "undefined") {
    //console.log("window is undefined");
    return {};
  }
  const hashPart = window.location.hash;
  if (hashPart.length !== 0) {
    try {
      const currentState = JSON.parse(
        decodeURIComponent(hashPart.substring(1, hashPart.length)),
      );
      return currentState ?? {};
    } catch (e) {
      return {};
    }
  } else {
    return {};
  }
}

export function mergePageState(
  stateToMerge: any,
  oldStateRef: React.MutableRefObject<any>,
) {
  const merged = { ...oldStateRef.current, ...stateToMerge };
  oldStateRef.current = merged;
}

export function setPageStateToUrlHash(state: React.MutableRefObject<any>) {
  if (typeof window !== "undefined") {
    window.history.replaceState(
      null,
      "",
      "#" + encodeURIComponent(JSON.stringify(state.current)),
    );
  }
}

export function containAnyHash(): boolean {
  if (typeof window === "undefined") {
    console.log("window is undefined");
  }
  return typeof window !== "undefined" && window.location.hash.length !== 0;
}

export function clearPageStateFromUrlHash() {
  if (typeof window !== "undefined" && (window.location.hash ?? "") !== "") {
    window.history.replaceState(null, "", window.location.href.split("#")[0]);
  }
}

export function clearExternalParam() {
  if (typeof window !== "undefined") {
    //remove dumb fbclid and such
    const url: URL = new URL(
      `${window.location.protocol}//${window.location.host}/`,
    );
    window.history.replaceState(null, "", url);
  }
}
