import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { useSoundProctor } from "./useSoundProctor";
import { useFullScreenProctor } from "./useFullScreenProctor";

export type Violation = {
  type: string;
  time: string;
};

export function useProctoring(videoRef: React.RefObject<HTMLVideoElement | null>,  examStarted: boolean) {
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
  useSoundProctor(addViolation, examStarted);

  // 🔒 Fullscreen + tab lock
  const { startProctoring, stopProctoring } = useFullScreenProctor({
    violations,
    addViolation,
    examStarted,
  });

  // 👤 Face detection using FaceMesh
  useEffect(() => {
    if (!videoRef.current) return;

    if (!examStarted) return;
    
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const count = results.multiFaceLandmarks?.length || 0;

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
          await faceMesh.send({ image: videoRef.current });
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
