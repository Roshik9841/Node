import { useRef } from "react";
import { useProctoring } from "./useProctoring";

export default function ProctorCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

 const { faceDetected, violations, startProctoring, stopProctoring } =
  useProctoring(videoRef);

  return (
    <div style={{ padding: 20 }}>
      <h2>Proctoring System</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ border: "1px solid black" }}
      />
      <button onClick={startProctoring}>Start Exam</button>
<button onClick={stopProctoring}>Exit Exam</button>
      <p>
        Face Status:{" "}
        <strong style={{ color: faceDetected ? "green" : "red" }}>
          {faceDetected ? "Face Detected" : "No Face Detected"}
        </strong>
      </p>

      <p>Violations recorded: {violations.length}</p>

      <ul>
        {violations.map((v, i) => (
          <li key={i}>
            {v.type} at {v.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
