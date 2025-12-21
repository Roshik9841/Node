import { useRef, useEffect } from "react";

export default function ProctorCamera() {
  const videoRef = useRef(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Webcam access denied or error:", err);
      }
    };

    enableCamera();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Proctor Camera Test</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "300px", border: "2px solid black" }}
      />
    </div>
  );
}
