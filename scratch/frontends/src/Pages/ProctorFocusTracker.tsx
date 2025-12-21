import { useEffect, useState } from "react";

export default function ProctorFocusTracker() {
  const [violations, setViolations] = useState([]);

  const addViolation = (type: string) => {
    const entry = {
      type,
      time: new Date().toISOString(),
    };
    setViolations((prev) => [...prev, entry]);
    console.warn("Violation Recorded:", entry);
  };

  useEffect(() => {
    const onBlur = () => {
      addViolation("WINDOW_BLUR");
    };

    const onFocus = () => {
      console.log("Window Focus Restored");
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        addViolation("TAB_SWITCH");
      }
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div>
      <h2>Focus & Tab Switch Test</h2>
      <p>Violations recorded: {violations.length}</p>

      <ul>
        {violations.map((v, index) => (
          <li key={index}>
            {v.type} at {v.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
