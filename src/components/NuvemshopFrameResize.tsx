import React, { useEffect } from "react";
import { Platform } from "react-native";
import { getNuvemshopParentOrigin } from "../integrations/nuvemshopBridge";

export function NuvemshopFrameResize() {
  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof window === "undefined" ||
      window.parent === window
    )
      return;

    const sendHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      window.parent.postMessage(
        { type: "resize", height },
        getNuvemshopParentOrigin(),
      );
    };
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(sendHeight);
    observer?.observe(document.documentElement);
    sendHeight();
    window.addEventListener("resize", sendHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", sendHeight);
    };
  }, []);

  return null;
}

