import { useRef } from "react";

export default function ProctorScreenShare() {
  const screenVideoRef = useRef(null);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Screen Share rejected or failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Screen Share Test</h2>
      <button onClick={startScreenShare}>
        Share Screen
      </button>

      <div style={{ marginTop: 20 }}>
        <video
          ref={screenVideoRef}
          autoPlay
          playsInline
          style={{ width: "300px", border: "2px solid blue" }}
        />
      </div>
    </div>
  );
}
