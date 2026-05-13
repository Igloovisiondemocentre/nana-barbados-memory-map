import { type CSSProperties, type FormEvent, useEffect, useMemo, useState } from "react";
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

type AppPage = "map" | "boda";

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
  const [page, setPage] = useState<AppPage>(() => (window.location.hash === "#boda" ? "boda" : "map"));
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
    const nextHash = page === "boda" ? "#boda" : "#map";
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [page]);

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
    const parish = String(formData.get("parish") ?? parishOptions[0].name);
    const village = String(formData.get("village") ?? "").trim();
    const story = String(formData.get("story") ?? "").trim();
    const tags = String(formData.get("tags") ?? "").trim();
    const streetViewUrl = String(formData.get("streetViewUrl") ?? "").trim();
    const photoFile = formData.get("photo");
    const audioFile = formData.get("audio");
    const parishPoint = parishOptions.find((item) => item.name === parish) ?? parishOptions[0];

    if (!title || !village || !story) {
      setPinError("Add a title, village and memory before saving the pin.");
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
          village,
          story,
          tags,
          streetViewUrl,
          photoSrc,
          audioSrc,
          mapPosition: {
            x: parishPoint.x + Math.min(userPins.length, 4) * 1.2,
            y: parishPoint.y + (userPins.length % 2 === 0 ? 0 : 2),
          },
        },
      ]);
      setPinError("");
      setActiveId(id);
      setFamilyLayerVisible(false);
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
          <button type="button" className={`navButton ${page === "boda" ? "active" : ""}`} onClick={() => setPage("boda")}>
            <MapPinned size={21} />
            <span>BODA</span>
          </button>
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
            className={`familyNavButton ${familyLayerVisible ? "active" : ""}`}
            aria-pressed={familyLayerVisible}
            onClick={() => {
              setFamilyLayerVisible((visible) => {
                const nextVisible = !visible;
                if (!nextVisible) {
                  setSelectedFamilyPointId(null);
                }
                return nextVisible;
              });
            }}
          >
            <Users size={22} />
            <span>Family Layer</span>
            <small>Beta</small>
          </button>
          <button type="button" className="menuButton" aria-label="Open menu">
            <Menu size={32} />
          </button>
        </nav>
      </header>

      {page === "map" ? (
      <main className="mapOnlyShell" id="memory-map">
        <section className="heroMapStage" aria-label="Interactive Barbados memory map">
          <div className="mobileMemorialTitle" aria-hidden="true">
            <span>In Loving Memory</span>
            <strong>Meg Goodman</strong>
          </div>
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
      ) : (
        <main className="bodaPage" id="boda">
          <section className="bodaHero">
            <div>
              <span>BODA Constitution</span>
              <h1>Heritage is something young people can add to, not just observe.</h1>
              <p>
                This page connects Nana's Barbados to BODA's wider aim: helping families document parish,
                village, voice, images and memory as living heritage.
              </p>
            </div>
            <button type="button" className="xrButton" onClick={() => setPage("map")}>
              <MapPinned size={20} />
              View the map
            </button>
          </section>

          <section className="constitutionGrid" aria-label="BODA constitution and aims">
            <article>
              <span>Constitution holder</span>
              <h2>Purpose</h2>
              <p>
                BODA exists to connect Barbadian family memory with place: parish, village, story,
                archive, audio and photographs.
              </p>
            </article>
            <article>
              <span>Aims</span>
              <h2>What this web app should make possible</h2>
              <ul>
                <li>Let visitors identify their parish and tag a family village.</li>
                <li>Let families add pictures, audio, written memories and context.</li>
                <li>Keep Nana's story intact while opening a path for other families to contribute.</li>
                <li>Limit early personal maps to five pins so the experience stays readable.</li>
              </ul>
            </article>
            <article>
              <span>Participation model</span>
              <h2>From visitor to contributor</h2>
              <p>
                Someone can read Nana's story, then begin their own small memory layer. The first version
                saves this on the device and shows those pins as a personal family layer.
              </p>
            </article>
          </section>

          <section className="contributionBuilder" aria-label="Create your BODA family pins">
            <div className="builderIntro">
              <span>Your family layer</span>
              <h2>Add up to 5 personal pins</h2>
              <p>
                Add the same kind of information a 360 memory needs: place, village, story, picture,
                Street View point, voice note and tags. These pins stay local for now.
              </p>
              <strong>{userPins.length}/5 pins used</strong>
            </div>

            <form className="pinForm" onSubmit={addUserPin}>
              <label>
                <span>Memory title</span>
                <input name="title" maxLength={80} placeholder="Grandad's fishing story" />
              </label>
              <label>
                <span>Parish</span>
                <select name="parish" defaultValue={parishOptions[0].name}>
                  {parishOptions.map((parish) => (
                    <option key={parish.name} value={parish.name}>
                      {parish.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Family village</span>
                <input name="village" maxLength={70} placeholder="The Gap, Speightstown..." />
              </label>
              <label>
                <span>Tags</span>
                <input name="tags" maxLength={90} placeholder="food, school, church, migration" />
              </label>
              <label className="wide">
                <span>Google Street View link</span>
                <input
                  name="streetViewUrl"
                  type="url"
                  inputMode="url"
                  placeholder="Paste a Google Street View or Maps link"
                />
              </label>
              <label className="wide">
                <span>Memory / context</span>
                <textarea name="story" rows={5} maxLength={600} placeholder="What happened here? Who told you? Why does it matter?" />
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
                Add pin
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
