import { useEffect, useMemo, useState } from "react";
import { BadgeInfo, Box, ExternalLink, KeyRound, LoaderCircle, MapPin } from "lucide-react";
import type { MemoryPoint } from "../types";

type MediaViewerProps = {
  memory: MemoryPoint;
};

export function MediaViewer({ memory }: MediaViewerProps) {
  const [isStreetViewOpen, setIsStreetViewOpen] = useState(false);
  const [isStreetViewLoading, setIsStreetViewLoading] = useState(false);
  const [showStreetViewHelp, setShowStreetViewHelp] = useState(false);
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isEmbed = memory.media.kind === "embed";
  const isGoogleStreetView = memory.media.kind === "google-street-view";
  const savedStreetViewUrl = memory.media.externalStreetViewUrl?.trim() ?? "";
  const canLoadStreetView = Boolean(isGoogleStreetView && googleMapsKey && memory.media.google);

  useEffect(() => {
    setIsStreetViewOpen(false);
    setIsStreetViewLoading(false);
    setShowStreetViewHelp(false);
  }, [memory.id]);

  useEffect(() => {
    if (!isStreetViewLoading) {
      return;
    }
    const timer = window.setTimeout(() => {
      setShowStreetViewHelp(true);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [isStreetViewLoading]);

  const streetViewUrl = useMemo(() => {
    if (!canLoadStreetView || !memory.media.google) {
      return "";
    }
    const { panoId, lat, lng, heading, pitch = 0, fov = 85 } = memory.media.google;
    const params = new URLSearchParams({
      key: googleMapsKey ?? "",
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
  }, [canLoadStreetView, googleMapsKey, memory.media.google]);

  const googleMapsUrl = useMemo(() => {
    if (savedStreetViewUrl) {
      return savedStreetViewUrl;
    }
    if (!memory.media.google) {
      return "";
    }
    const { lat, lng } = memory.media.google;
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  }, [memory.media.google, savedStreetViewUrl]);

  return (
    <section className="mediaPanel" aria-labelledby="active-memory-title">
      <div className="mediaFrame">
        {isGoogleStreetView && isStreetViewOpen && streetViewUrl ? (
          <iframe
            src={streetViewUrl}
            title={`${memory.title} Street View`}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => {
              setIsStreetViewLoading(false);
              setShowStreetViewHelp(true);
            }}
          />
        ) : isEmbed ? (
          <iframe
            src={memory.media.src}
            title={memory.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <img src={memory.media.src} alt={memory.media.alt} />
        )}
        {isGoogleStreetView && !isStreetViewOpen ? (
          <div className="streetViewGate">
            {googleMapsKey ? <MapPin size={22} /> : <KeyRound size={22} />}
            <strong>
              {googleMapsKey ? "Street View is ready" : savedStreetViewUrl ? "Google Maps link ready" : "Google key needed"}
            </strong>
            <span>
              {googleMapsKey
                ? "Load the 360 scene when you are ready to view this place."
                : savedStreetViewUrl
                  ? "Open the saved Google Maps point to move around near this place."
                : "Add VITE_GOOGLE_MAPS_API_KEY to .env.local to enable 360 views."}
            </span>
          </div>
        ) : null}
        {isGoogleStreetView && isStreetViewOpen && (isStreetViewLoading || showStreetViewHelp) ? (
          <div className={isStreetViewLoading ? "streetViewStatus loading" : "streetViewStatus"}>
            {isStreetViewLoading ? <LoaderCircle size={17} /> : <BadgeInfo size={17} />}
            <span>
              {isStreetViewLoading
                ? "Loading the 360 place view..."
                : "If the view stays dark, Google may still be loading or the API key may need site/billing access."}
            </span>
            {googleMapsUrl ? (
              <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            ) : null}
          </div>
        ) : null}
        <div className="mediaOverlay">
          <span>
            <Box size={15} />
            {isGoogleStreetView ? "Google Street View" : memory.media.kind === "local-360" ? "360-ready place view" : "Archive visual"}
          </span>
          <button
            type="button"
            onClick={() => {
              if (canLoadStreetView) {
                setIsStreetViewOpen(true);
                setIsStreetViewLoading(true);
                setShowStreetViewHelp(false);
                return;
              }
              if (savedStreetViewUrl) {
                window.open(savedStreetViewUrl, "_blank", "noopener,noreferrer");
              }
            }}
            disabled={isGoogleStreetView && !canLoadStreetView && !savedStreetViewUrl}
          >
            <ExternalLink size={15} />
            {isStreetViewOpen ? "360 Open" : savedStreetViewUrl && !canLoadStreetView ? "Open 360" : "Enter 360"}
          </button>
        </div>
      </div>
      <div className="memoryCopy">
        <span className="regionLabel">{memory.region}</span>
        <h2 id="active-memory-title">{memory.title}</h2>
        <strong className="childSubtitle">{memory.childSubtitle}</strong>
        <p>{memory.description}</p>
        <div className="tagRow">
          {memory.familyTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {memory.media.credit ? (
          <small className="mediaCredit">
            <BadgeInfo size={14} />
            {memory.media.credit}
          </small>
        ) : null}
      </div>
    </section>
  );
}
