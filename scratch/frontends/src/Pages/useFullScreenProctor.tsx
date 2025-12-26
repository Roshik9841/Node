import { useEffect, useRef } from "react";

type Violation = {
  type: string;
  time: string;
};

type Props = {
  violations: Violation[];
  addViolation: (type: string) => void;
};

export function useFullScreenProctor({ violations, addViolation }: Props) {
  const allowExitRef = useRef(false);

  /* ===========================
     ▶️ START EXAM (USER CLICK)
  ============================ */
  const startProctoring = () => {
    allowExitRef.current = false;

    const el = document.documentElement;

    if (!document.fullscreenElement && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        alert("Fullscreen permission is required to start the exam.");
      });
    }
  };

  /* ===========================
     ⏹ STOP EXAM
  ============================ */
  const stopProctoring = () => {
    allowExitRef.current = true;
    // Optional: do NOT force exit fullscreen (safer)
  };

  /* ===========================
     ⛔ Restricted Keys
  ============================ */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const restrictedKeys = ["F12", "F5", "Escape", "PrintScreen"];

      const blockedCombos =
        (e.ctrlKey && e.key.toLowerCase() === "s") || // Ctrl+S
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) || // DevTools
        (e.ctrlKey && e.key.toLowerCase() === "u"); // View source

      if (restrictedKeys.includes(e.key) || blockedCombos) {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === "PrintScreen") {
          addViolation("SCREENSHOT");
        } else if (blockedCombos) {
          addViolation("DEVTOOLS");
        } else {
          addViolation("RESTRICTED_KEY");
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [addViolation]);

  /* ===========================
     🖱 Right Click
  ============================ */
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation("RIGHT_CLICK");
    };

    document.addEventListener("contextmenu", onContextMenu, true);
    return () =>
      document.removeEventListener("contextmenu", onContextMenu, true);
  }, [addViolation]);

  /* ===========================
     🔄 Refresh / Navigation
  ============================ */
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      addViolation("PAGE_REFRESH");
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [addViolation]);

  /* ===========================
     🖥 Prevent Fullscreen Exit
  ============================ */
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !allowExitRef.current) {
        addViolation("EXIT_FULLSCREEN");
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [addViolation]);

  /* ===========================
     🔁 Tab / Window switch
  ============================ */
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
  }, [addViolation]);

  /* ===========================
     ❌ Auto terminate
  ============================ */
  useEffect(() => {
    const MAX_TAB_VIOLATIONS = 10;
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
