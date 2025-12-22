import { useRef, useEffect, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

export default function ProctorCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    faceDetection.onResults((results) => {
      if (results.detections && results.detections.length > 0) {
        setFaceDetected(true);
      } else {
        setFaceDetected(false);
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

    return () => {
      cameraRef.current?.stop();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Proctor Camera</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
      
      />

      <p>
        Status:{" "}
        <strong style={{ color: faceDetected ? "green" : "red" }}>
          {faceDetected ? "Face Detected" : "No Face Detected"}
        </strong>
      </p>
    </div>
  );
}
