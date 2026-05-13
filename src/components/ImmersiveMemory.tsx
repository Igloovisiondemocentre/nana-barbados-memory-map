import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BadgeInfo, ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { AmbientSound } from "./AmbientSound";
import type { MemoryPoint } from "../types";

type ImmersiveMemoryProps = {
  memory: MemoryPoint;
  autoPlaySignal: number;
  journeyStep?: number;
  journeyTotal?: number;
  hasPreviousMemory?: boolean;
  hasNextMemory?: boolean;
  onPreviousMemory?: () => void;
  onNextMemory?: () => void;
  onMemoryEnded?: () => void;
  onClose: () => void;
};

export function ImmersiveMemory({
  memory,
  autoPlaySignal,
  journeyStep,
  journeyTotal,
  hasPreviousMemory = false,
  hasNextMemory = false,
  onPreviousMemory,
  onNextMemory,
  onMemoryEnded,
  onClose,
}: ImmersiveMemoryProps) {
  const [showSceneGuide, setShowSceneGuide] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const hasManualJourneyStopRef = useRef(false);
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const journeyStops = useMemo(() => {
    if (memory.media.journeyStops?.length) {
      return memory.media.journeyStops;
    }
    if (memory.media.google) {
      return [
        {
          label: memory.viewName,
          role: "Nana's reference" as const,
          note: memory.media.credit ?? memory.description,
          google: memory.media.google,
        },
      ];
    }
    return [];
  }, [memory]);
  const activeJourneyStop = journeyStops[journeyIndex] ?? journeyStops[0];

  useEffect(() => {
    setShowSceneGuide(false);
    setJourneyIndex(0);
    hasManualJourneyStopRef.current = false;
  }, [memory.id]);

  const streetViewUrl = useMemo(() => {
    const google = activeJourneyStop?.google ?? memory.media.google;
    if (!googleMapsKey || !google) {
      return "";
    }
    const { panoId, lat, lng, heading, pitch = 0, fov = 86 } = google;
    const params = new URLSearchParams({
      key: googleMapsKey,
      heading: `${heading}`,
      pitch: `${pitch}`,
      fov: `${fov}`,
    });
    if (panoId) {
      params.set("pano", panoId);
    } else {
      params.set("location", `${lat},${lng}`);
    }
    return `https://www.google.com/maps/embed/v1/streetview?${params.toString()}`;
  }, [activeJourneyStop, googleMapsKey, memory.media.google]);

  const googleMapsUrl = useMemo(() => {
    const google = activeJourneyStop?.google ?? memory.media.google;
    if (!google) {
      return "";
    }
    const { lat, lng } = google;
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  }, [activeJourneyStop, memory.media.google]);

  const handleAudioProgress = (currentTime: number, duration: number) => {
    if (!duration || journeyStops.length < 2 || hasManualJourneyStopRef.current) {
      return;
    }
    const nextIndex = currentTime >= duration / 2 ? 1 : 0;
    setJourneyIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
  };

  return (
    <section className="immersiveMemory" aria-label={`${memory.title} immersive view`}>
      {streetViewUrl ? (
        <iframe
          src={streetViewUrl}
          title={`${memory.title} Street View`}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <img src={memory.media.src} alt={memory.media.alt} />
      )}

      <div className="immersiveTop">
        <button type="button" className="backButton" onClick={onClose}>
          <ArrowLeft size={18} />
          Back to map
        </button>
        <span className="viewBadge">
          <MapPin size={16} />
          {activeJourneyStop?.label ?? memory.viewName}
        </span>
        {journeyStep && journeyTotal ? (
          <span className="viewBadge journeyBadge">
            Journey {journeyStep} of {journeyTotal}
          </span>
        ) : null}
        {onPreviousMemory || onNextMemory ? (
          <div className="journeyMemoryControls" aria-label="Memory journey controls">
            <button
              type="button"
              onClick={onPreviousMemory}
              disabled={!hasPreviousMemory}
              aria-label="Previous memory"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button type="button" onClick={onNextMemory} disabled={!hasNextMemory} aria-label="Next memory">
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        ) : null}
        {journeyStops.length > 1 ? (
          <div className="journeyStops" aria-label="360 journey stops">
            {journeyStops.map((stop, index) => (
              <button
                key={`${stop.label}-${index}`}
                type="button"
                className={index === journeyIndex ? "active" : ""}
                onClick={() => {
                  hasManualJourneyStopRef.current = true;
                  setJourneyIndex(index);
                }}
              >
                <span>{index + 1}</span>
                {stop.role}
              </button>
            ))}
          </div>
        ) : null}
        {memory.sceneContext ? (
          <button
            type="button"
            className={`sceneGuideButton ${showSceneGuide ? "active" : ""}`}
            onClick={() => setShowSceneGuide((value) => !value)}
            aria-expanded={showSceneGuide}
          >
            <BadgeInfo size={16} />
            Scene guide
          </button>
        ) : null}
      </div>

      {!streetViewUrl ? (
        <div className="immersiveStatus compact">
          <BadgeInfo size={17} />
          <span>Street View needs the Google Maps key in the local environment.</span>
        </div>
      ) : null}

      <div className="immersiveStory">
        <span>{memory.region}</span>
        <h1>{memory.title}</h1>
        <strong>{memory.childSubtitle}</strong>
        <p>{memory.description}</p>
      </div>

      {memory.sceneContext && showSceneGuide ? (
        <aside className="sceneGuidePanel" aria-label={`${memory.title} scene guide`}>
          <div>
            <span className="sceneKicker">What Nana is showing us</span>
            <h2>{memory.viewName}</h2>
            {activeJourneyStop ? (
              <strong className="activeStopNote">
                {activeJourneyStop.role}: {activeJourneyStop.note}
              </strong>
            ) : null}
            <p>{memory.sceneContext.summary}</p>
          </div>
          <div>
            <span className="sceneKicker">Why this place</span>
            <p>{memory.sceneContext.whyThisView}</p>
          </div>
          <div>
            <span className="sceneKicker">Look for</span>
            <ul>
              {memory.sceneContext.lookFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="sceneLandmarks">
            <span className="sceneKicker">Landmarks and context</span>
            {memory.sceneContext.landmarks.map((landmark) => (
              <a
                key={`${landmark.label}-${landmark.kind}`}
                href={landmark.sourceUrl ?? googleMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{landmark.label}</strong>
                <small>{landmark.note}</small>
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
          <span className={`sceneConfidence ${memory.sceneContext.confidence.replace(/\s+/g, "-").toLowerCase()}`}>
            {memory.sceneContext.confidence}
          </span>
        </aside>
      ) : null}

      <AudioPlayer
        memory={memory}
        autoPlaySignal={autoPlaySignal}
        mode="immersive"
        onProgress={handleAudioProgress}
        onEnded={onMemoryEnded}
      />
      <AmbientSound profile={memory.ambientProfile} active={autoPlaySignal > 0} />
    </section>
  );
}
