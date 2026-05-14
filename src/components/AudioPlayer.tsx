import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { MemoryPoint } from "../types";

type AudioPlayerProps = {
  memory: MemoryPoint;
  autoPlaySignal?: number;
  mode?: "dock" | "immersive";
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
};

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export function AudioPlayer({ memory, autoPlaySignal = 0, mode = "dock", onProgress, onEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [memory.audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || autoPlaySignal === 0) {
      return;
    }
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [autoPlaySignal, memory.audioSrc]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={mode === "immersive" ? "audioDock immersiveAudio" : "audioDock"}>
      <audio
        ref={audioRef}
        src={memory.audioSrc || undefined}
        preload="metadata"
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
          onProgress?.(event.currentTarget.currentTime, event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
          onProgress?.(event.currentTarget.currentTime, event.currentTarget.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />
      <div className="audioMeta">
        <span>Listen</span>
        <strong>{memory.title}</strong>
      </div>
      <button
        type="button"
        className="roundControl primary"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause narration" : "Play narration"}
      >
        {isPlaying ? <Pause size={21} /> : <Play size={21} />}
      </button>
      <div className="waveform" aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => (
          <i
            key={index}
            className={index / 42 <= progress / 100 ? "active" : ""}
            style={{ "--height": `${28 + ((index * 17) % 44)}%` } as CSSProperties}
          />
        ))}
      </div>
      <div className="timeReadout">
        <span>{formatTime(currentTime)}</span>
        <span>{duration ? formatTime(duration) : memory.duration}</span>
      </div>
      <button
        type="button"
        className="roundControl"
        onClick={restart}
        aria-label="Restart narration"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
