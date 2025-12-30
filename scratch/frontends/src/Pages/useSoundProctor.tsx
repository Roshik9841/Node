import { useEffect, useRef } from "react";

type SoundViolationCallback = (type: string) => void;

export function useSoundProctor(
  onViolation: SoundViolationCallback,
  examStarted: boolean
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);

  const baselineRmsRef = useRef<number | null>(null);
  const outOfRangeSinceRef = useRef<number | null>(null);
  const lastViolationRef = useRef(0);

  /* 
     RMS calculation helper
*/
  const calculateRms = (data: Float32Array) => {
    let sumSquares = 0;
    for (let i = 0; i < data.length; i++) {
      sumSquares += data[i] * data[i];
    }
    return Math.sqrt(sumSquares / data.length);
  };

  /* 
     Dynamic range (from Whisper)
 */
  const calculateAmplitudeRange = (rms: number): [number, number] => {
    const str = rms.toFixed(9);
    const decimals = str.split(".")[1] || "";
    const firstNonZero = decimals.search(/[1-9]/);

    const adjustment =
      firstNonZero !== -1
        ? parseFloat("0." + "0".repeat(firstNonZero) + "09")
        : 0.000000001;

    return [
      Math.max(0, rms - adjustment) / 9,
      (rms + adjustment) * 50,
    ];
  };

  useEffect(() => {
    if (!examStarted) return;

    let stream: MediaStream;
    let calibrationStart = Date.now();
    let calibrationSamples: number[] = [];

    const init = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Float32Array(analyser.fftSize);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      monitor();
    };

    const monitor = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getFloatTimeDomainData(dataArrayRef.current);
      const rms = calculateRms(dataArrayRef.current);

      /* 
         Calibration phase (5 sec)
 */
      if (!baselineRmsRef.current) {
        calibrationSamples.push(rms);

        if (Date.now() - calibrationStart > 5000) {
          baselineRmsRef.current =
            calibrationSamples.reduce((a, b) => a + b, 0) /
            calibrationSamples.length;
        }

        requestAnimationFrame(monitor);
        return;
      }

      /*
         Detection phase
     */
      const [min, max] = calculateAmplitudeRange(baselineRmsRef.current);
      const inRange = rms >= min && rms <= max;

      if (!inRange) {
        if (!outOfRangeSinceRef.current) {
          outOfRangeSinceRef.current = Date.now();
        }

        // Out of range for 3 seconds
        if (
          Date.now() - outOfRangeSinceRef.current > 3000 &&
          Date.now() - lastViolationRef.current > 5000
        ) {
          onViolation("VOICE_DETECTED");
          lastViolationRef.current = Date.now();
        }
      } else {
        outOfRangeSinceRef.current = null;
      }

      requestAnimationFrame(monitor);
    };

    init();

    return () => {
      stream?.getTracks().forEach(t => t.stop());
      audioContextRef.current?.close();
      baselineRmsRef.current = null;
    };
  }, [examStarted, onViolation]);
}
