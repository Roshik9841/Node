import { useRef, useState, useEffect } from "react";
import { useProctoring } from "./useProctoring";

export default function ProctorCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [toggle, setToggle] = useState(true); // Start Exam button
  const [timeLeft, setTimeLeft] = useState(300); // 5 min in seconds
  const [examStarted, setExamStarted] = useState(false);
  const { faceDetected, violations, startProctoring, stopProctoring } =
    useProctoring(videoRef, examStarted); // pass examStarted flag

  // Timer effect
  useEffect(() => {
    if (!examStarted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const handleStartExam = () => {
    startProctoring();
    setToggle(false);
    setExamStarted(true);
  };

  const handleSubmit = () => {
    stopProctoring();
    setExamStarted(false);
    setToggle(true);
    alert("Exam submitted automatically!");
    // Here you can also send violations or answers to backend
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Proctoring System</h2>

      <div className="flex justify-center mb-2">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-80 h-60 border-2 border-gray-300 rounded-md object-center"
        />
      </div>

      <div className="text-center mb-4 font-semibold">
        {examStarted && <p>Time Left: {formatTime(timeLeft)}</p>}
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {toggle && (
          <button
            onClick={handleStartExam}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
          >
            Start Exam
          </button>
        )}

        <button
          onClick={handleSubmit}
          className={`px-4 py-2 font-semibold rounded transition ${
            toggle
              ? "bg-red-300 text-white cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          disabled={toggle}
        >
          Submit
        </button>
      </div>

      <div className="mb-4 text-center">
        <p>
          Face Status:{" "}
          <strong
            className={`${
              faceDetected ? "text-green-600" : "text-red-600"
            } font-semibold`}
          >
            {faceDetected ? "Face Detected" : "No Face Detected"}
          </strong>
        </p>
      </div>

      {examStarted && (
        <div>
          <p className="font-semibold mb-2">
            Violations recorded: {violations.length}
          </p>
          <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
            {violations.map((v, i) => (
              <li key={i} className="text-gray-700">
                {v.type} at {v.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
