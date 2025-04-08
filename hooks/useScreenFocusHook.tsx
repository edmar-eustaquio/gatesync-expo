import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function useScreenFocusHook(func: () => void) {
  useFocusEffect(useCallback(func, []));
  return null;
}
