import { useRef, useEffect, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { useSoundProctor } from "./useSoundProctor";
type Violation = {
  type: string;
  time: string;
};

export default function ProctorCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);

  
  // Track last time user was focused
  const lastFocusTimeRef = useRef(Date.now());
  const lastFaceTimeRef = useRef(Date.now());

  const addViolation = (type: string) => {
    const entry: Violation = {
      type,
      time: new Date().toISOString(),
    };
    setViolations((prev) => [...prev, entry]);
    console.warn("Violation Recorded:", entry);
  };

  useSoundProctor((type) => {
    addViolation(type);
  });
  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Face Detection
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    faceDetection.onResults((results) => {
      const faceCount = results.detections?.length || 0;

      if (faceCount === 0) {
        setFaceDetected(false);
        lastFaceTimeRef.current = Date.now();
        addViolation("NO_FACE");
      } else if (faceCount > 1) {
        setFaceDetected(true);
        lastFaceTimeRef.current = Date.now();
        addViolation("MULTIPLE_FACES");
      } else {
        setFaceDetected(true);
        lastFaceTimeRef.current = Date.now();
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        //up faceDetection.send garesi  onResults  call hunxa
        if (videoRef.current)
          await faceDetection.send({ image: videoRef.current });
      },
      width: 300,
      height: 200,
    });

    cameraRef.current.start();

    return () => {
      cameraRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    // Window/tab focus detection
    const onBlur = () => {
      lastFocusTimeRef.current = Date.now();
      addViolation("WINDOW_BLUR");
    };
    const onFocus = () => {
      console.log("Window Focus Restored");
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        lastFocusTimeRef.current = Date.now();
        addViolation("TAB_SWITCH");
      }
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Check time-based violations every second
    const interval = setInterval(() => {
      // >5 seconds no face
      if (Date.now() - lastFaceTimeRef.current > 5000)
        addViolation("ABSENT_5S");

      // >5 seconds out of focus
      if (Date.now() - lastFocusTimeRef.current > 5000) addViolation("AWAY_5S");
    }, 1000);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(interval);
    };
  }, []);

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

      <p>
        Face Status:{" "}
        <strong style={{ color: faceDetected ? "green" : "red" }}>
          {faceDetected ? "Face Detected" : "No Face Detected"}
        </strong>
      </p>

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
