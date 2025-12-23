import { useEffect } from "react";

type Violation = {
  type: string;
  time: string;
};

type Props = {
  violations: Violation[];
  addViolation: (type: string) => void;
};


export function useFullScreenProctor({ violations, addViolation }: Props) {
  const startProctoring = async () => {
    await document.documentElement.requestFullscreen();
  };

  const stopProctoring = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  // ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        addViolation("ESC_PRESSED");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Fullscreen exit
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        addViolation("EXIT_FULLSCREEN");
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Tab / window switch
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) addViolation("TAB_SWITCH");
    };

    const onBlur = () => addViolation("WINDOW_BLUR");

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // Auto terminate exam
  useEffect(() => {
    const MAX_TAB_VIOLATIONS = 1;

    const tabCount = violations.filter(
      (v) => v.type === "TAB_SWITCH"
    ).length;

    if (tabCount >= MAX_TAB_VIOLATIONS) {
      alert("Exam terminated due to tab switching");
      stopProctoring();
    }
  }, [violations]);

  return {
    startProctoring,
    stopProctoring,
  };
}
