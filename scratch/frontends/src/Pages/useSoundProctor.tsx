import { useEffect, useRef } from "react";

type SoundViolationCallback = (type: string) => void;

export function useSoundProctor(
  onViolation: SoundViolationCallback,
  examStarted: boolean,
  volumeThreshold = 0.08 // tweak if needed
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const soundStartRef = useRef<number | null>(null);
  const lastViolationRef = useRef(0);

  useEffect(() => {
    if (!examStarted) return;

    let stream: MediaStream;

    const initAudio = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      source.connect(analyser);

      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      detectSound();
    };

    const detectSound = () => {
      if (!analyserRef.current || !dataArrayRef.current || !examStarted) return;

      // Get time domain data for RMS calculation
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      // Calculate RMS (Root Mean Square)
      let sumSquares = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const normalized = (dataArrayRef.current[i] - 128) / 128; // Normalize to -1 to 1
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / dataArrayRef.current.length);

      if (rms > volumeThreshold) {
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
  }, [examStarted, onViolation, volumeThreshold]);
}
