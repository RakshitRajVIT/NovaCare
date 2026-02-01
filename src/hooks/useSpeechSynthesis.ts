import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find the best female voice - prefer soft, sweet sounding voices
    const femaleVoiceNames = [
      'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona',
      'veena', 'alex', 'allison', 'ava', 'susan', 'zira', 'hazel',
      'heather', 'female', 'woman', 'girl', 'microsoft zira', 
      'google uk english female', 'google us english female'
    ];
    
    const preferredVoice = voices.find(
      (voice) => 
        voice.lang.startsWith('en') && 
        femaleVoiceNames.some(name => voice.name.toLowerCase().includes(name))
    ) || voices.find(
      (voice) => voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
    ) || voices.find((voice) => voice.lang.startsWith('en')) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Slightly higher pitch for a sweeter, more feminine sound
    utterance.rate = 0.95;  // Slightly slower for a sultry effect
    utterance.pitch = 1.3;  // Higher pitch for feminine voice
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
};
