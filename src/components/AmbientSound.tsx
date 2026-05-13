import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { AmbientProfile } from "../types";

type AmbientSoundProps = {
  profile: AmbientProfile;
  active: boolean;
};

const profileLabels: Record<AmbientProfile, string> = {
  coast: "Sea breeze",
  village: "Village air",
  school: "Quiet grounds",
  city: "Town hum",
  heritage: "Heritage room",
};

function createNoiseBuffer(context: AudioContext) {
  const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function connectNoise(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  gainValue: number,
) {
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context);
  source.loop = true;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.7;

  const gain = context.createGain();
  gain.gain.value = gainValue;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start();

  return source;
}

function connectTone(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  gainValue: number,
  type: OscillatorType = "sine",
) {
  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const gain = context.createGain();
  gain.gain.value = gainValue;

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start();

  return oscillator;
}

function playChirp(context: AudioContext, destination: AudioNode, frequency: number, gainValue: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.34, context.currentTime + 0.08);
  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(gainValue, context.currentTime + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.22);
}

function connectChirps(
  context: AudioContext,
  destination: AudioNode,
  gainValue: number,
  minDelay: number,
  maxDelay: number,
) {
  let timer = 0;
  const schedule = () => {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    timer = window.setTimeout(() => {
      const frequency = 1150 + Math.random() * 1250;
      playChirp(context, destination, frequency, gainValue);
      if (Math.random() > 0.55) {
        window.setTimeout(() => playChirp(context, destination, frequency * 1.18, gainValue * 0.75), 150);
      }
      schedule();
    }, delay);
  };
  schedule();
  return () => window.clearTimeout(timer);
}

export function AmbientSound({ profile, active }: AmbientSoundProps) {
  const [isMuted, setIsMuted] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active || isMuted) {
      gainRef.current?.gain.setTargetAtTime(0, gainRef.current.context.currentTime, 0.05);
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0.09;
    master.connect(context.destination);

    const sources: AudioScheduledSourceNode[] = [];
    const cleanupTasks: Array<() => void> = [];
    if (profile === "coast") {
      sources.push(connectNoise(context, master, 820, 0.58));
      sources.push(connectNoise(context, master, 180, 0.18));
      cleanupTasks.push(connectChirps(context, master, 0.006, 6500, 11000));
    } else if (profile === "village") {
      sources.push(connectNoise(context, master, 1550, 0.2));
      sources.push(connectTone(context, master, 420, 0.012, "sine"));
      sources.push(connectTone(context, master, 780, 0.008, "triangle"));
      cleanupTasks.push(connectChirps(context, master, 0.014, 1800, 4400));
    } else if (profile === "school") {
      sources.push(connectNoise(context, master, 700, 0.15));
      sources.push(connectTone(context, master, 260, 0.012, "sine"));
      cleanupTasks.push(connectChirps(context, master, 0.008, 3600, 7000));
    } else if (profile === "city") {
      sources.push(connectNoise(context, master, 390, 0.22));
      sources.push(connectTone(context, master, 92, 0.018, "sine"));
    } else {
      sources.push(connectNoise(context, master, 560, 0.16));
      sources.push(connectTone(context, master, 196, 0.014, "sine"));
      sources.push(connectTone(context, master, 294, 0.009, "triangle"));
      cleanupTasks.push(connectChirps(context, master, 0.006, 6500, 12000));
    }

    contextRef.current = context;
    gainRef.current = master;

    return () => {
      master.gain.setTargetAtTime(0, context.currentTime, 0.04);
      window.setTimeout(() => {
        cleanupTasks.forEach((cleanup) => cleanup());
        sources.forEach((source) => {
          try {
            source.stop();
          } catch {
            // Source may already be stopped during fast view changes.
          }
        });
        void context.close();
      }, 120);
      contextRef.current = null;
      gainRef.current = null;
    };
  }, [active, isMuted, profile]);

  return (
    <button
      type="button"
      className="ambientToggle"
      onClick={() => setIsMuted((value) => !value)}
      aria-pressed={isMuted}
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      <span>{isMuted ? "Ambience off" : profileLabels[profile]}</span>
    </button>
  );
}
