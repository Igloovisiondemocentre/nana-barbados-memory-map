import { type CSSProperties, type FormEvent, type PointerEvent, useEffect, useMemo, useState } from "react";
import {
  Camera,
  Gamepad2,
  Headphones,
  MapPinned,
  Menu,
  MessageCircle,
  Plus,
  Send,
  Share2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { BarbadosMap } from "./components/BarbadosMap";
import { FamilyArchivePanel } from "./components/FamilyArchivePanel";
import { ImmersiveMemory } from "./components/ImmersiveMemory";
import { familyPoints } from "./data/familyPoints";
import { memories } from "./data/memories";
import type { MemoryPoint } from "./types";
import { assetPath } from "./utils/assets";

const userPinsStorageKey = "bodaUserPins";

const bodaGptAgentUrl =
  "https://chatgpt.com/g/g-6a038f0d8c6081919f5540134c939e81-boda-strategy-diaspora-connector";
const bodaChatEndpoint =
  import.meta.env.VITE_DEPLOY_TARGET === "github-pages"
    ? ""
    : import.meta.env.VITE_BODA_CHAT_ENDPOINT || "/api/boda-chat";

const immersiveJourneyIds = [
  "natural-environment",
  "northern-point-caves",
  "sugar-food-economics",
  "anne-downy-roots",
  "school",
  "anne-downy-care",
  "village",
  "nicknames-middle-names",
  "patricia-memory",
  "dads-education",
  "leaving-barbados",
  "anne-downy-farms",
  "universities-colonisation",
  "family-heritage",
  "accent-language",
  "advice-grandchildren",
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AppPage = "map" | "boda" | "contribute";

type UserPin = {
  id: string;
  title: string;
  parish: string;
  village: string;
  story: string;
  tags: string;
  streetViewUrl?: string;
  photoSrc?: string;
  audioSrc?: string;
  mapPosition: {
    x: number;
    y: number;
  };
};

const parishOptions = [
  { name: "Saint Lucy", x: 22, y: 17 },
  { name: "Saint Peter", x: 25, y: 35 },
  { name: "Saint Andrew", x: 51, y: 39 },
  { name: "Saint James", x: 19, y: 58 },
  { name: "Saint Joseph", x: 65, y: 56 },
  { name: "Saint Thomas", x: 39, y: 66 },
  { name: "Saint Michael", x: 25, y: 80 },
  { name: "Christ Church", x: 47, y: 91 },
  { name: "Saint George", x: 65, y: 79 },
  { name: "Saint John", x: 81, y: 65 },
];

const barbadosBounds = {
  north: 13.35,
  south: 13.04,
  west: -59.66,
  east: -59.42,
};

const getNearestParish = (position: { x: number; y: number }) =>
  parishOptions.reduce((nearest, parish) => {
    const currentDistance = Math.hypot(position.x - parish.x, position.y - parish.y);
    const nearestDistance = Math.hypot(position.x - nearest.x, position.y - nearest.y);
    return currentDistance < nearestDistance ? parish : nearest;
  }, parishOptions[0]);

const streetViewUrlFromPosition = (position: { x: number; y: number }) => {
  const lat = barbadosBounds.north - (position.y / 100) * (barbadosBounds.north - barbadosBounds.south);
  const lng = barbadosBounds.west + (position.x / 100) * (barbadosBounds.east - barbadosBounds.west);
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat.toFixed(5)},${lng.toFixed(5)}`;
};

const journeyMemories = immersiveJourneyIds
  .map((id) => memories.find((memory) => memory.id === id))
  .filter((memory): memory is (typeof memories)[number] => Boolean(memory));

const readFileAsDataUrl = (file: File | null) =>
  new Promise<string | undefined>((resolve, reject) => {
    if (!file) {
      resolve(undefined);
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(typeof reader.result === "string" ? reader.result : undefined));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });

export default function App() {
  const [page, setPage] = useState<AppPage>(() => {
    if (window.location.hash === "#boda") {
      return "boda";
    }
    if (window.location.hash === "#contribute") {
      return "contribute";
    }
    return "map";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(memories[0].id);
  const [immersiveId, setImmersiveId] = useState<string | null>(null);
  const [autoPlaySignal, setAutoPlaySignal] = useState(0);
  const [journeyModeActive, setJourneyModeActive] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Wuh loss, welcome. Ask me about Nana's Barbados, family roots, archives, or what you seeing on the map.",
    },
  ]);
  const [chatError, setChatError] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [userPins, setUserPins] = useState<UserPin[]>(() => {
    try {
      const storedPins = window.localStorage.getItem(userPinsStorageKey);
      return storedPins ? (JSON.parse(storedPins) as UserPin[]) : [];
    } catch {
      return [];
    }
  });
  const [pinError, setPinError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [draftMapPosition, setDraftMapPosition] = useState({ x: 47, y: 58 });
  const [familyLayerVisible, setFamilyLayerVisible] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("family") === "1";
  });
  const [selectedFamilyPointId, setSelectedFamilyPointId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("familyPoint");
  });
  const [showIntroVideo, setShowIntroVideo] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "1") {
      return true;
    }
    if (params.get("intro") === "0") {
      return false;
    }
    if (params.get("family") === "1") {
      return false;
    }
    return sessionStorage.getItem("nanaIntroSeen") !== "true";
  });
  const userMemories = useMemo<MemoryPoint[]>(
    () =>
      userPins.map((pin): MemoryPoint => {
        return {
          id: pin.id,
          title: pin.title,
          childSubtitle: pin.village ? `${pin.village}, ${pin.parish}` : pin.parish,
          region: pin.parish,
          viewName: pin.title,
          audioSrc: pin.audioSrc ?? "",
          ambientProfile: "heritage",
          duration: pin.audioSrc ? "Voice note" : "No audio yet",
          mapPosition: pin.mapPosition,
          description: pin.story,
          media: {
            kind: pin.streetViewUrl ? "google-street-view" : "local-image",
            src: pin.photoSrc ?? assetPath("assets/memorial/meg-goodman-mobile-background.png"),
            alt: pin.photoSrc ? `${pin.title} family memory image` : "Memorial background",
            credit: "Your BODA memory pin",
            externalStreetViewUrl: pin.streetViewUrl,
          },
          familyTags: pin.tags
            ? pin.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
            : ["personal pin"],
        };
      }),
    [userPins],
  );
  const allMemories = useMemo(() => [...memories, ...userMemories], [userMemories]);
  const activeMemory = useMemo(
    () => allMemories.find((memory) => memory.id === activeId) ?? allMemories[0],
    [activeId, allMemories],
  );
  const immersiveMemory = useMemo(
    () => allMemories.find((memory) => memory.id === immersiveId) ?? null,
    [immersiveId, allMemories],
  );
  const selectedFamilyPoint = useMemo(
    () => familyPoints.find((point) => point.id === selectedFamilyPointId) ?? null,
    [selectedFamilyPointId],
  );
  const allFamilyPoints = useMemo(() => familyPoints, []);
  const immersiveJourneyIndex = useMemo(() => {
    if (!journeyModeActive || !immersiveId) {
      return -1;
    }
    return journeyMemories.findIndex((memory) => memory.id === immersiveId);
  }, [immersiveId, journeyModeActive]);

  useEffect(() => {
    window.localStorage.setItem(userPinsStorageKey, JSON.stringify(userPins));
  }, [userPins]);

  useEffect(() => {
    const nextHash = page === "boda" ? "#boda" : page === "contribute" ? "#contribute" : "#map";
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [page]);

  const navigateToPage = (nextPage: AppPage) => {
    setPage(nextPage);
    setMenuOpen(false);
  };

  const updateDraftMapPosition = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(92, Math.max(8, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(94, Math.max(6, ((event.clientY - rect.top) / rect.height) * 100));
    setDraftMapPosition({ x, y });
  };

  const openMemory = (id: string) => {
    setJourneyModeActive(false);
    setActiveId(id);
    setImmersiveId(id);
    setAutoPlaySignal((value) => value + 1);
  };

  const startImmersiveJourney = () => {
    const firstMemory = journeyMemories[0] ?? memories[0];
    setJourneyModeActive(true);
    setActiveId(firstMemory.id);
    setImmersiveId(firstMemory.id);
    setAutoPlaySignal((value) => value + 1);
  };

  const goToImmersiveJourneyIndex = (index: number) => {
    const memory = journeyMemories[index];
    if (!memory) {
      return false;
    }
    setActiveId(memory.id);
    setImmersiveId(memory.id);
    setAutoPlaySignal((value) => value + 1);
    return true;
  };

  const advanceImmersiveJourney = () => {
    if (!journeyModeActive || !immersiveId) {
      return;
    }
    const moved = goToImmersiveJourneyIndex(immersiveJourneyIndex + 1);
    if (!moved) {
      setJourneyModeActive(false);
    }
  };

  const previousImmersiveJourneyMemory = () => {
    if (!journeyModeActive || immersiveJourneyIndex <= 0) {
      return;
    }
    goToImmersiveJourneyIndex(immersiveJourneyIndex - 1);
  };

  const finishIntroVideo = () => {
    sessionStorage.setItem("nanaIntroSeen", "true");
    setShowIntroVideo(false);
  };

  const addUserPin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userPins.length >= 5) {
      setPinError("You can add up to 5 pins in this version.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const parish = getNearestParish(draftMapPosition).name;
    const placeNote = String(formData.get("placeNote") ?? "").trim();
    const story = String(formData.get("story") ?? "").trim();
    const tags = String(formData.get("tags") ?? "").trim();
    const streetViewUrl = streetViewUrlFromPosition(draftMapPosition);
    const photoFile = formData.get("photo");
    const audioFile = formData.get("audio");

    if (!title || !story) {
      setPinError("Add a title and memory before saving the pin.");
      return;
    }

    try {
      const [photoSrc, audioSrc] = await Promise.all([
        readFileAsDataUrl(photoFile instanceof File && photoFile.size > 0 ? photoFile : null),
        readFileAsDataUrl(audioFile instanceof File && audioFile.size > 0 ? audioFile : null),
      ]);
      const id = `user-pin-${Date.now()}`;
      setUserPins((pins) => [
        ...pins,
        {
          id,
          title,
          parish,
          village: placeNote || `Dropped pin near ${parish}`,
          story,
          tags,
          streetViewUrl,
          photoSrc,
          audioSrc,
          mapPosition: draftMapPosition,
        },
      ]);
      setPinError("");
      setActiveId(id);
      setFamilyLayerVisible(false);
      setPage("map");
      form.reset();
    } catch {
      setPinError("The media file could not be read. Try a smaller photo or audio clip.");
    }
  };

  const removeUserPin = (id: string) => {
    setUserPins((pins) => pins.filter((pin) => pin.id !== id));
    if (selectedFamilyPointId === id) {
      setSelectedFamilyPointId(null);
    }
  };

  const sharePins = async () => {
    const text = `I added ${userPins.length} family heritage pin${userPins.length === 1 ? "" : "s"} to Nana's Barbados Memory Map.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My BODA heritage pins", text, url: window.location.href });
        setShareMessage("Share sheet opened.");
        return;
      }
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setShareMessage("Share text copied.");
    } catch {
      setShareMessage("Share was cancelled.");
    }
  };

  const sendChatMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = chatInput.trim();
    if (!content || chatLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...chatMessages, { role: "user", content }];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatError("");
    setChatLoading(true);

    try {
      if (!bodaChatEndpoint) {
        throw new Error("Embedded chat needs an API backend. Use the full BODA GPT link for now.");
      }

      const response = await fetch(bodaChatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok || !body.reply) {
        throw new Error(body.error || "Chat is not available yet.");
      }

      setChatMessages((messages) => [...messages, { role: "assistant", content: body.reply }]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Chat is not available yet.");
    } finally {
      setChatLoading(false);
    }
  };

  const draftParish = getNearestParish(draftMapPosition);
  const draftStreetViewUrl = streetViewUrlFromPosition(draftMapPosition);

  return (
    <div
      className="app"
      style={
        {
          "--scrapbook-bg": `url("${assetPath("assets/images/nana-scrapbook-background.png")}")`,
          "--window-drawing-bg": `url("${assetPath("assets/images/nana-window-drawing.jpg")}")`,
          "--mobile-memorial-bg": `url("${assetPath("assets/memorial/meg-goodman-mobile-background.png")}")`,
        } as CSSProperties
      }
    >
      <div className="paperGrain" aria-hidden="true" />
      <header className="appHeader landingHeader">
        <button type="button" className="brand brandButton" onClick={() => setPage("map")} aria-label="BODA Nana's Barbados home">
          <img src={assetPath("assets/images/boda-logo-transparent.png")} alt="BODA logo" />
          <span className="titleLockup">
            <strong>Nana's Barbados</strong>
            <em>Memory Map</em>
          </span>
        </button>
        <nav className="headerNav landingNav" aria-label="Primary">
          <button type="button" className="xrButton" onClick={startImmersiveJourney}>
            <Gamepad2 size={22} />
            <span>Enter 360</span>
          </button>
          {page === "map" ? (
            <div className="enter360Nudge" aria-hidden="true">
              Come on my little ones, let me tell you about Barbados
            </div>
          ) : null}
          <button
            type="button"
            className={`menuButton ${menuOpen ? "active" : ""}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu size={32} />
          </button>
          {menuOpen ? (
            <div className="headerMenu" role="menu">
              <button type="button" role="menuitem" onClick={() => navigateToPage("boda")}>
                <MapPinned size={18} />
                About BODA
              </button>
              <button type="button" role="menuitem" onClick={() => navigateToPage("contribute")}>
                <Plus size={18} />
                Add your pin
              </button>
              <button
                type="button"
                role="menuitem"
                className={familyLayerVisible ? "active" : ""}
                onClick={() => {
                  setFamilyLayerVisible((visible) => {
                    const nextVisible = !visible;
                    if (!nextVisible) {
                      setSelectedFamilyPointId(null);
                    }
                    return nextVisible;
                  });
                  setMenuOpen(false);
                  setPage("map");
                }}
              >
                <Users size={18} />
                Family layer {familyLayerVisible ? "on" : "off"}
              </button>
            </div>
          ) : null}
        </nav>
      </header>

      {page === "map" ? (
      <main className="mapOnlyShell" id="memory-map">
        <section className="heroMapStage" aria-label="Interactive Barbados memory map">
          <div className="mobileMemorialTitle" aria-hidden="true">
            <span>In Loving Memory</span>
            <strong>Meg Goodman</strong>
          </div>
          <img
            className="mobileMemorialPortrait"
            src={assetPath("assets/memorial/meg-goodman-mobile-background.png")}
            alt=""
            aria-hidden="true"
          />
          <div className="heroDrawing" aria-hidden="true" />
          <img
            className="memorialPortraitWash"
            src={assetPath("assets/memorial/meg-goodman-memorial.png")}
            alt=""
            aria-hidden="true"
          />
          <button
            type="button"
            className="bodaGptSticker"
            onClick={() => setChatOpen(true)}
            aria-expanded={chatOpen}
            aria-label="Ask the BODA GPT agent"
          >
            <span>
              <MessageCircle size={18} />
              BODA GPT
            </span>
            <strong>Ask me sumting, nuh!</strong>
          </button>
          {chatOpen ? (
            <aside className="bodaChatPanel" aria-label="BODA GPT chat">
              <header>
                <div>
                  <span>BODA GPT</span>
                  <h2>Ask me sumting, nuh!</h2>
                </div>
                <button type="button" onClick={() => setChatOpen(false)} aria-label="Close BODA GPT chat">
                  <X size={18} />
                </button>
              </header>
              <div className="bodaChatMessages" aria-live="polite">
                {chatMessages.map((message, index) => (
                  <p key={`${message.role}-${index}`} className={message.role}>
                    {message.content}
                  </p>
                ))}
                {chatLoading ? <p className="assistant">Hol' on, I checking that...</p> : null}
              </div>
              {chatError ? <strong className="bodaChatError">{chatError}</strong> : null}
              <form className="bodaChatForm" onSubmit={sendChatMessage}>
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  maxLength={600}
                  placeholder="Ask about Nana, Barbados, roots..."
                  aria-label="Message BODA GPT"
                />
                <button type="submit" disabled={chatLoading || !chatInput.trim()} aria-label="Send message">
                  <Send size={17} />
                </button>
              </form>
              <a className="bodaChatFallback" href={bodaGptAgentUrl} target="_blank" rel="noreferrer">
                Open full BODA GPT
              </a>
            </aside>
          ) : null}
          <BarbadosMap
            memories={allMemories}
            activeId={activeMemory.id}
            onSelect={openMemory}
            familyPoints={allFamilyPoints}
            familyLayerVisible={familyLayerVisible}
            selectedFamilyPointId={selectedFamilyPointId}
            onSelectFamilyPoint={setSelectedFamilyPointId}
            minimal
          />
          {familyLayerVisible ? (
            <FamilyArchivePanel selectedFamilyPoint={selectedFamilyPoint} />
          ) : null}
          {showIntroVideo ? (
            <div className="introVideoLayer" aria-label="Memorial animation">
              <video
                src={assetPath("assets/video/nana-intro-animation.mp4")}
                poster={assetPath("assets/memorial/meg-goodman-memorial.png")}
                autoPlay
                muted
                playsInline
                onEnded={finishIntroVideo}
                onError={finishIntroVideo}
              />
              <button type="button" onClick={finishIntroVideo}>
                Skip intro
              </button>
            </div>
          ) : null}
        </section>
      </main>
      ) : page === "boda" ? (
        <main className="bodaPage" id="boda">
          <section className="bodaHero">
            <div>
              <span>About BODA</span>
              <h1>Barbados Overseas Descendants Association</h1>
              <p>
                The constitution sets out BODA's name, charitable aims, membership, officers,
                committee powers, finance rules and governance procedures.
              </p>
            </div>
            <button type="button" className="xrButton" onClick={() => navigateToPage("contribute")}>
              <Plus size={20} />
              Add your pin
            </button>
          </section>

          <section className="constitutionGrid" aria-label="BODA constitution and aims">
            <article>
              <span>Name</span>
              <h2>Barbados Overseas Descendants Association</h2>
              <p>The Association will be known as Barbados Overseas Descendants Association (BODA).</p>
            </article>
            <article>
              <span>Aims and objectives</span>
              <h2>Culture, health, mentoring and community cohesion</h2>
              <ul>
                <li>Promote awareness of Barbadian cultural traditions, customs, festivals and arts, especially among children and young people.</li>
                <li>Advance public education in healthy living and healthy lifestyles.</li>
                <li>Offer coaching and mentoring opportunities to the community.</li>
                <li>Relieve hardship, sickness, poor health and isolation in Croydon, Lambeth, Lewisham, Wandsworth and surrounding areas.</li>
                <li>Promote community cohesion by involving all members of the community in activities.</li>
              </ul>
            </article>
            <article>
              <span>Principles</span>
              <h2>Non-profit, non-partisan and inclusive</h2>
              <p>
                BODA is non-partisan in politics, non-sectarian in beliefs and non-profit in its work.
                It works for the elimination of discrimination on the basis of race, gender, age,
                sexuality, disability and religious beliefs.
              </p>
            </article>
            <article>
              <span>Membership</span>
              <h2>Full and associate members</h2>
              <p>
                Full membership is open to Barbadians and their descendants. Associate membership is open
                to those with sympathetic views of BODA's aims and objectives, sponsored by a full member.
              </p>
            </article>
            <article>
              <span>Officers and powers</span>
              <h2>Annual officers and lawful powers</h2>
              <p>
                Members elect officers at the AGM, including Chair, Deputy Chair, Secretary, Treasurer
                and any other relevant position. BODA may raise money, open bank accounts, insure,
                employ staff, manage property, organise courses and events, and work with other groups.
              </p>
            </article>
            <article>
              <span>Governance</span>
              <h2>Committee, finance and meetings</h2>
              <p>
                The committee keeps minutes, meets at least four times a year including the AGM, manages
                finances through the Treasurer, presents audited accounts, and handles discipline,
                appeals, constitutional amendments and dissolution through the procedures set out in the constitution.
              </p>
            </article>
            <article>
              <span>Finance</span>
              <h2>Funds are held for BODA's work</h2>
              <p>
                Funds may be raised through subscriptions, donations, raffles and fundraising. The Treasurer
                keeps financial records, pays approved expenses, and presents accounts for audit or independent examination.
              </p>
            </article>
            <article>
              <span>Meetings</span>
              <h2>Members shape the association</h2>
              <p>
                The AGM receives accounts and elects officers. Members can nominate officers in advance,
                vote where posts are contested, and call extraordinary meetings through the constitution's rules.
              </p>
            </article>
            <article>
              <span>Discipline and changes</span>
              <h2>Fair process and member approval</h2>
              <p>
                The constitution includes notice, appeals and voting procedures for discipline, amendments,
                and dissolution, so decisions are handled transparently by the committee and members.
              </p>
            </article>
          </section>
        </main>
      ) : (
        <main className="bodaPage contributePage" id="contribute">
          <section className="contributionBuilder" aria-label="Create your BODA family pins">
            <div className="builderIntro">
              <span>Add to the memory map</span>
              <h2>Drop a pin where your memory belongs</h2>
              <p>
                Tap or drag the pin on Barbados, then add the memory details. The app will create a
                nearby Google Street View point from the position you choose.
              </p>
              <strong>{userPins.length}/5 pins used</strong>
            </div>

            <div className="pinPlacePicker">
              <div
                className="pinPickerMap"
                role="application"
                aria-label="Choose where this memory belongs on the Barbados map"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  updateDraftMapPosition(event);
                }}
                onPointerMove={(event) => {
                  if (event.buttons === 1) {
                    updateDraftMapPosition(event);
                  }
                }}
              >
                <img src={assetPath("assets/images/barbados-scrapbook-map-sticker.png")} alt="" aria-hidden="true" />
                <span
                  className="draftMemoryPin"
                  style={{ left: `${draftMapPosition.x}%`, top: `${draftMapPosition.y}%` }}
                  aria-hidden="true"
                >
                  <MapPinned size={18} />
                </span>
              </div>
              <p>
                Selected near <strong>{draftParish.name}</strong>. Street View point:
                <a href={draftStreetViewUrl} target="_blank" rel="noreferrer"> open preview</a>
              </p>
            </div>

            <form className="pinForm" onSubmit={addUserPin}>
              <label>
                <span>Whose memory is this?</span>
                <input name="title" maxLength={80} placeholder="Auntie June's Speightstown memory" />
              </label>
              <label>
                <span>Place note</span>
                <input name="placeNote" maxLength={70} placeholder="Family village, road, school, church..." />
              </label>
              <label>
                <span>Tags</span>
                <input name="tags" maxLength={90} placeholder="food, school, church, migration" />
              </label>
              <label className="wide">
                <span>What should people know?</span>
                <textarea name="story" rows={5} maxLength={600} placeholder="What happened here? Who told you? Why does this place matter?" />
              </label>
              <label className="mediaInput">
                <Camera size={18} />
                <span>Add picture</span>
                <input name="photo" type="file" accept="image/*" />
              </label>
              <label className="mediaInput">
                <Headphones size={18} />
                <span>Add voice note</span>
                <input name="audio" type="file" accept="audio/*" />
              </label>
              {pinError ? <strong className="pinError">{pinError}</strong> : null}
              <button type="submit" disabled={userPins.length >= 5}>
                <Plus size={18} />
                Add to memory map
              </button>
            </form>
          </section>

          <section className="userPinsPanel" aria-label="Your saved heritage pins">
            <header>
              <div>
                <span>Saved locally</span>
                <h2>Your BODA pins</h2>
              </div>
              <button type="button" onClick={sharePins} disabled={!userPins.length}>
                <Share2 size={17} />
                Share result
              </button>
            </header>
            {shareMessage ? <p className="shareMessage">{shareMessage}</p> : null}
            <div className="userPinList">
              {userPins.length ? (
                userPins.map((pin) => (
                  <article key={pin.id} className="userPinCard">
                    {pin.photoSrc ? <img src={pin.photoSrc} alt="" /> : null}
                    <div>
                      <span>{pin.parish}</span>
                      <h3>{pin.title}</h3>
                      <strong>{pin.village}</strong>
                      <p>{pin.story}</p>
                      {pin.tags ? <small>{pin.tags}</small> : null}
                      {pin.streetViewUrl ? (
                        <a className="pinStreetViewLink" href={pin.streetViewUrl} target="_blank" rel="noreferrer">
                          Google Street View point
                        </a>
                      ) : null}
                      {pin.audioSrc ? <audio src={pin.audioSrc} controls /> : null}
                    </div>
                    <button type="button" onClick={() => removeUserPin(pin.id)} aria-label={`Remove ${pin.title}`}>
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))
              ) : (
                <p className="emptyPins">No personal pins yet. Add one and it will appear on the memory map.</p>
              )}
            </div>
          </section>
        </main>
      )}

      {immersiveMemory ? (
        <ImmersiveMemory
          memory={immersiveMemory}
          autoPlaySignal={autoPlaySignal}
          journeyStep={
            journeyModeActive
              ? immersiveJourneyIndex + 1
              : undefined
          }
          journeyTotal={journeyModeActive ? journeyMemories.length : undefined}
          hasPreviousMemory={journeyModeActive && immersiveJourneyIndex > 0}
          hasNextMemory={journeyModeActive && immersiveJourneyIndex >= 0 && immersiveJourneyIndex < journeyMemories.length - 1}
          onPreviousMemory={journeyModeActive ? previousImmersiveJourneyMemory : undefined}
          onNextMemory={journeyModeActive ? advanceImmersiveJourney : undefined}
          onMemoryEnded={advanceImmersiveJourney}
          onClose={() => {
            setJourneyModeActive(false);
            setImmersiveId(null);
          }}
        />
      ) : null}
    </div>
  );
}
