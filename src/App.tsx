import { type CSSProperties, type FormEvent, useMemo, useState } from "react";
import { Gamepad2, Menu, MessageCircle, Send, Users, X } from "lucide-react";
import { BarbadosMap } from "./components/BarbadosMap";
import { FamilyArchivePanel } from "./components/FamilyArchivePanel";
import { ImmersiveMemory } from "./components/ImmersiveMemory";
import { familyPoints } from "./data/familyPoints";
import { memories } from "./data/memories";
import { assetPath } from "./utils/assets";

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

const journeyMemories = immersiveJourneyIds
  .map((id) => memories.find((memory) => memory.id === id))
  .filter((memory): memory is (typeof memories)[number] => Boolean(memory));

export default function App() {
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
  const activeMemory = useMemo(
    () => memories.find((memory) => memory.id === activeId) ?? memories[0],
    [activeId],
  );
  const immersiveMemory = useMemo(
    () => memories.find((memory) => memory.id === immersiveId) ?? null,
    [immersiveId],
  );
  const selectedFamilyPoint = useMemo(
    () => familyPoints.find((point) => point.id === selectedFamilyPointId) ?? null,
    [selectedFamilyPointId],
  );
  const immersiveJourneyIndex = useMemo(() => {
    if (!journeyModeActive || !immersiveId) {
      return -1;
    }
    return journeyMemories.findIndex((memory) => memory.id === immersiveId);
  }, [immersiveId, journeyModeActive]);

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
        } as CSSProperties
      }
    >
      <div className="paperGrain" aria-hidden="true" />
      <header className="appHeader landingHeader">
        <a className="brand" href="/" aria-label="BODA Nana's Barbados home">
          <img src={assetPath("assets/images/boda-logo-transparent.png")} alt="BODA logo" />
          <span className="titleLockup">
            <strong>Nana's Barbados</strong>
            <em>Memory Map</em>
          </span>
        </a>
        <nav className="headerNav landingNav" aria-label="Primary">
          <button type="button" className="xrButton" onClick={startImmersiveJourney}>
            <Gamepad2 size={22} />
            <span>Enter 360</span>
          </button>
          <div className="enter360Nudge" aria-hidden="true">
            Come on my little ones, let me tell you about Barbados
          </div>
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

      <main className="mapOnlyShell" id="memory-map">
        <section className="heroMapStage" aria-label="Interactive Barbados memory map">
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
            memories={memories}
            activeId={activeMemory.id}
            onSelect={openMemory}
            familyPoints={familyPoints}
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
