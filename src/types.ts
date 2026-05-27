export type MediaKind = "local-image" | "local-360" | "video" | "embed" | "google-street-view";
export type AmbientProfile = "coast" | "village" | "school" | "city" | "heritage";

export type GoogleStreetView = {
  panoId?: string;
  lat: number;
  lng: number;
  heading: number;
  pitch?: number;
  fov?: number;
};

export type MemoryJourneyStop = {
  label: string;
  role: "Nana's reference" | "Area landmark" | "Family photograph";
  note: string;
  google?: GoogleStreetView;
  imageSrc?: string;
  imageAlt?: string;
  externalStreetViewUrl?: string;
};

export type MemoryPoint = {
  id: string;
  title: string;
  childSubtitle: string;
  region: string;
  viewName: string;
  audioSrc: string;
  ambientProfile: AmbientProfile;
  duration: string;
  mapPosition: {
    x: number;
    y: number;
  };
  description: string;
  sceneContext?: {
    summary: string;
    whyThisView: string;
    lookFor: string[];
    confidence: "Confirmed landmark" | "Nearby best fit" | "Research needed";
    landmarks: Array<{
      label: string;
      kind: "landmark" | "natural" | "history" | "family" | "viewpoint";
      note: string;
      sourceUrl?: string;
    }>;
  };
  media: {
    kind: MediaKind;
    src: string;
    alt: string;
    credit?: string;
    google?: GoogleStreetView;
    journeyStops?: MemoryJourneyStop[];
    externalStreetViewUrl?: string;
  };
  familyTags: string[];
};

export type FamilyPoint = {
  id: string;
  title: string;
  shortLabel: string;
  place: string;
  confidence: "High" | "Medium" | "Low";
  category: "family" | "records" | "burial" | "culture";
  mapPosition: {
    x: number;
    y: number;
  };
  labelOffset: {
    x: number;
    y: number;
    anchor: "start" | "end";
  };
  summary: string;
  sourceLabel: string;
  sourceUrl?: string;
};

export type FamilyPerson = {
  id: string;
  name: string;
  branch: "Meg cluster" | "Lynch-Goodman cluster" | "Goodman-Lynch-Alleyne archive" | "Separate Goodman branch";
  relation: string;
  evidence: string;
  confidence: "High" | "Medium" | "Low";
};

export type FamilyTimelineEvent = {
  id: string;
  date: string;
  title: string;
  summary: string;
  status: "Documented" | "Probable" | "Family notice" | "Research target" | "Family archive";
};

export type FamilyTreeBranch = {
  id: string;
  title: string;
  note: string;
  confidence: "High" | "Medium" | "Low";
  generations: string[][];
};
