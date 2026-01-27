import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioVisualizationReturn {
  isListening: boolean;
  audioLevel: number;
  audioData: Float32Array | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
}

export const useAudioVisualization = (): UseAudioVisualizationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  const startListening = useCallback(async () => {
    try {
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      
      streamRef.current = stream;

      // Create audio context and analyser
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Connect microphone to analyser
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);

      // Start visualization loop
      const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
      
      const updateVisualization = () => {
        if (analyserRef.current) {
          analyserRef.current.getFloatTimeDomainData(dataArray);
          setAudioData(new Float32Array(dataArray));

          // Calculate RMS for audio level
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          setAudioLevel(Math.min(1, rms * 5));
        }
        
        animationRef.current = requestAnimationFrame(updateVisualization);
      };

      updateVisualization();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  }, []);

  const stopListening = useCallback(() => {
    // Stop animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsListening(false);
    setAudioLevel(0);
    setAudioData(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    audioLevel,
    audioData,
    startListening,
    stopListening,
    error,
  };
};

export default useAudioVisualization;