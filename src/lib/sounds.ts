export const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {
    console.error("Audio error", e);
  }
}

export const sounds = {
  click: () => playTone(600, 'sine', 0.1, 0.05),
  guess: () => {
    playTone(400, 'triangle', 0.1, 0.1);
    setTimeout(() => playTone(600, 'triangle', 0.2, 0.1), 100);
  },
  success: () => {
    playTone(523.25, 'sine', 0.2, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 150); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.4, 0.1), 300); // G5
  },
  fail: () => {
    playTone(300, 'sawtooth', 0.3, 0.05);
    setTimeout(() => playTone(250, 'sawtooth', 0.5, 0.05), 200);
  }
};
