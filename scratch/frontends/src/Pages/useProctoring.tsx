import { useEffect, useRef, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { useSoundProctor } from "./useSoundProctor";
import { useFullScreenProctor } from "./useFullScreenProctor";

export type Violation = {
  type: string;
  time: string;
};

export function useProctoring(videoRef: React.RefObject<HTMLVideoElement>,  examStarted: boolean) {
  const cameraRef = useRef<Camera | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);

  const lastViolationTimeRef = useRef<Record<string, number>>({});

  const addViolation = (type: string) => {
    const last = lastViolationTimeRef.current[type] || 0;
    if (Date.now() - last > 5000) {
      lastViolationTimeRef.current[type] = Date.now();
      setViolations((v) => [...v, { type, time: new Date().toISOString() }]);
    }
  };

  // 🔊 Sound
  useSoundProctor(addViolation);

  // 🔒 Fullscreen + tab lock
  const { startProctoring, stopProctoring } = useFullScreenProctor({
    violations,
    addViolation,
  });

  // 👤 Face detection
  useEffect(() => {
    if (!videoRef.current) return;

        if (!examStarted) return;
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    faceDetection.onResults((results) => {
      const count = results.detections?.length || 0;

      if (count === 0) {
        setFaceDetected(false);
        addViolation("NO_FACE");
      } else if (count > 1) {
        setFaceDetected(true);
        addViolation("MULTIPLE_FACES");
      } else {
        setFaceDetected(true);
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceDetection.send({ image: videoRef.current });
        }
      },
      width: 300,
      height: 200,
    });

    cameraRef.current.start();

    return () => cameraRef.current?.stop();
  }, [examStarted]);

  return {
    faceDetected,
    violations,
    startProctoring,
    stopProctoring,
  };
}
