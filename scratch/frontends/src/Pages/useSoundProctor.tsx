import { useEffect, useRef } from "react";

type SoundViolationCallback = (type: string) => void;

export function useSoundProctor(
  onViolation: SoundViolationCallback,
  volumeThreshold = 0.08 // tweak if needed
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const soundStartRef = useRef<number | null>(null);
  const lastViolationRef = useRef(0);

  useEffect(() => {
    let stream: MediaStream;

    const initAudio = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      detectSound();
    };

    const detectSound = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Normalize volume (0 - 1)
      const avg =
        dataArrayRef.current.reduce((a, b) => a + b, 0) /
        dataArrayRef.current.length /
        255;

      if (avg > volumeThreshold) {
        if (!soundStartRef.current) {
          soundStartRef.current = Date.now();
        }

        // Sound lasting > 3 seconds
        if (
          Date.now() - soundStartRef.current > 3000 &&
          Date.now() - lastViolationRef.current > 5000
        ) {
          onViolation("VOICE_DETECTED");
          lastViolationRef.current = Date.now();
        }
      } else {
        soundStartRef.current = null;
      }

      requestAnimationFrame(detectSound);
    };

    initAudio();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, []);
}
