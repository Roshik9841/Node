import { useRef, useState, useEffect } from "react";
import { useProctoring } from "./useProctoring";

export default function ProctorCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min

  const { faceDetected, violations, startProctoring, stopProctoring } =
    useProctoring(videoRef, examStarted);

  useEffect(() => {
    if (!examStarted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const handleStart = async () => {
    startProctoring();
    await navigator.mediaDevices.getUserMedia({ audio: true });
    setExamStarted(true);
  };

  const handleSubmit = () => {
    stopProctoring();
    setExamStarted(false);
    alert("Exam submitted");
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold text-center mb-4">Online Exam</h2>

      <div className="flex justify-center mb-3">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-80 h-56 border rounded"
        />
      </div>

      {examStarted && (
        <p className="text-center font-semibold mb-3">
          Time Left: {formatTime(timeLeft)}
        </p>
      )}

      <div className="flex justify-center gap-4 mb-4">
        {!examStarted && (
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Start Exam
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!examStarted}
          className={`px-4 py-2 rounded text-white ${
            examStarted ? "bg-red-600" : "bg-red-300"
          }`}
        >
          Submit
        </button>
      </div>

      <p className="text-center mb-3">
        Face Status:{" "}
        <span
          className={`font-bold ${
            faceDetected ? "text-green-600" : "text-red-600"
          }`}
        >
          {faceDetected ? "Detected" : "Not Detected"}
        </span>
      </p>

      {examStarted && (
        <div>
          <p className="font-semibold mb-1">
            Violations: {violations.length}
          </p>
          <ul className="max-h-40 overflow-y-auto border rounded p-2 text-sm">
            {violations.map((v, i) => (
              <li key={i}>
                {v.type} – {v.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
