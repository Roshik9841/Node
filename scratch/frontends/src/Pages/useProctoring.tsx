import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { useSoundProctor } from "./useSoundProctor";
import { useFullScreenProctor } from "./useFullScreenProctor";

export type Violation = {
  type: string;
  time: string;
};

export function useProctoring(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  examStarted: boolean
) {
  const cameraRef = useRef<Camera | null>(null);

  const [violations, setViolations] = useState<Violation[]>([]);
  const [faceDetected, setFaceDetected] = useState(false);

  const lastViolationRef = useRef<Record<string, number>>({});
  const yawStartRef = useRef<number | null>(null);

  const addViolation = (type: string) => {
    const last = lastViolationRef.current[type] || 0;
    if (Date.now() - last > 1000) {
      lastViolationRef.current[type] = Date.now();
      setViolations((v) => [
        ...v,
        { type, time: new Date().toISOString() },
      ]);
    }
  };

  useSoundProctor(addViolation, examStarted);

  const { startProctoring, stopProctoring } = useFullScreenProctor({
    violations,
    addViolation,
    examStarted,
  });

  // ---------- YAW CALCULATION ----------
  function calculateYaw(landmarks: any[]): number | null {
    if (!landmarks || landmarks.length < 264) return null;

    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];

    const eyeMidX = (leftEye.x + rightEye.x) / 2;
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);

    return (
      Math.atan2(nose.x - eyeMidX, eyeDistance) * (180 / Math.PI)
    );
  }

  // ---------- FACEMESH ----------
  useEffect(() => {
    if (!videoRef.current || !examStarted) return;

    const faceMesh = new FaceMesh({
      locateFile: (f) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const faces = results.multiFaceLandmarks || [];
      const count = faces.length;

      if (count === 0) {
        setFaceDetected(false);
        addViolation("NO_FACE");
        return;
      }

      if (count > 1) {
        setFaceDetected(true);
        addViolation("MULTIPLE_FACES");
        return;
      }

      setFaceDetected(true);

      // ---- YAW DETECTION ----
      const yaw = calculateYaw(faces[0]);
      if (yaw === null) return;

      const absYaw = Math.abs(yaw);

      if (absYaw > 20) {
        if (!yawStartRef.current) yawStartRef.current = Date.now();

        if (Date.now() - yawStartRef.current > 2000) {
          addViolation("EXTREME_HEAD_TURN");
        }
      } else {
        yawStartRef.current = null;
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

    return () => {
      cameraRef.current?.stop();
      yawStartRef.current = null;
    };
  }, [examStarted]);

  return {
    faceDetected,
    violations,
    startProctoring,
    stopProctoring,
  };
}
