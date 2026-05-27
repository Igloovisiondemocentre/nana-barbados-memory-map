import { useMemo, useRef, useState } from "react";
import { goodmanTrailData, type MemoryTokenId } from "../data/goodmanTrail";
import { assetPath } from "../utils/assets";

type GoodmanMysteryTrailProps = {
  onReturnToMap: () => void;
  onOpenHillabyPin: () => void;
};

type PortraitAnswers = Record<string, string>;

const shuffledTimeline = [...goodmanTrailData.timelineEvents].sort((a, b) => {
  const order = ["springvale-purchase", "gill-sighting", "queens-college", "springvale-museum", "iris-rufus", "archie-disappears", "cyrillene-born"];
  return order.indexOf(a.id) - order.indexOf(b.id);
});

type TrailSongPlayerProps = {
  title: string;
  description: string;
  src: string;
};

function TrailSongPlayer({ title, description, src }: TrailSongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <article className="heritageSongPlayer">
      <audio
        ref={audioRef}
        src={assetPath(src)}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div>
        <button type="button" onClick={togglePlayback}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={stopPlayback}>
          Stop
        </button>
      </div>
    </article>
  );
}

export function GoodmanMysteryTrail({ onReturnToMap, onOpenHillabyPin }: GoodmanMysteryTrailProps) {
  const [revealedOpeningLines, setRevealedOpeningLines] = useState(0);
  const [trailStarted, setTrailStarted] = useState(false);
  const [tokens, setTokens] = useState<MemoryTokenId[]>([]);
  const [portraitReveals, setPortraitReveals] = useState<Record<string, boolean>>({});
  const [portraitAnswers, setPortraitAnswers] = useState<PortraitAnswers>({});
  const [timelineOrder, setTimelineOrder] = useState<string[]>([]);
  const [timelineMessage, setTimelineMessage] = useState("Tap the earliest remaining event.");
  const [activeRumourPin, setActiveRumourPin] = useState(goodmanTrailData.rumourPins[0].id);
  const [visitedRumourPins, setVisitedRumourPins] = useState<Record<string, boolean>>({
    [goodmanTrailData.rumourPins[0].id]: true,
  });
  const [churchStep, setChurchStep] = useState(0);
  const [churchAnswer, setChurchAnswer] = useState("");
  const [activeLens, setActiveLens] = useState(goodmanTrailData.lenses[0].id);
  const [lensAnswer, setLensAnswer] = useState("");
  const [activeLyric, setActiveLyric] = useState(goodmanTrailData.lyricLines[0].id);
  const [decodedLyrics, setDecodedLyrics] = useState<Record<string, boolean>>({
    [goodmanTrailData.lyricLines[0].id]: true,
  });
  const [rhythmTaps, setRhythmTaps] = useState(0);
  const [shelfObjects, setShelfObjects] = useState<string[]>([]);
  const [activeToken, setActiveToken] = useState<MemoryTokenId>("song");
  const [caseActionMessage, setCaseActionMessage] = useState("");

  const unlockToken = (token: MemoryTokenId) => {
    setTokens((currentTokens) => (currentTokens.includes(token) ? currentTokens : [...currentTokens, token]));
  };

  const activePin =
    goodmanTrailData.rumourPins.find((pin) => pin.id === activeRumourPin) ?? goodmanTrailData.rumourPins[0];
  const activeLensCard =
    goodmanTrailData.lenses.find((lens) => lens.id === activeLens) ?? goodmanTrailData.lenses[0];
  const activeLyricCard =
    goodmanTrailData.lyricLines.find((line) => line.id === activeLyric) ?? goodmanTrailData.lyricLines[0];
  const activeFinalToken =
    goodmanTrailData.finalTokens.find((token) => token.id === activeToken) ?? goodmanTrailData.finalTokens[0];

  const portraitComplete = goodmanTrailData.portraitObjects.every((object) => portraitReveals[object.id]);
  const timelineComplete = timelineOrder.length === goodmanTrailData.timelineEvents.length;
  const rumourComplete = goodmanTrailData.rumourPins.every((pin) => visitedRumourPins[pin.id]);
  const lyricsComplete = goodmanTrailData.lyricLines.every((line) => decodedLyrics[line.id]);
  const shelfComplete = goodmanTrailData.archiveObjects.every((object) => shelfObjects.includes(object.id));
  const allTokensCollected = goodmanTrailData.finalTokens.every((token) => tokens.includes(token.id));

  const orderedTimeline = useMemo(
    () =>
      [...goodmanTrailData.timelineEvents]
        .sort((a, b) => a.order - b.order)
        .filter((event) => timelineOrder.includes(event.id)),
    [timelineOrder],
  );

  const revealOpeningLine = () => {
    setRevealedOpeningLines((count) => Math.min(count + 1, goodmanTrailData.openingLines.length));
  };

  const revealPortraitObject = (objectId: string) => {
    const nextReveals = { ...portraitReveals, [objectId]: true };
    setPortraitReveals(nextReveals);
    if (goodmanTrailData.portraitObjects.every((object) => nextReveals[object.id])) {
      unlockToken("man");
    }
  };

  const answerPortraitQuestion = (objectId: string, answer: string) => {
    setPortraitAnswers((answers) => ({ ...answers, [objectId]: answer }));
  };

  const chooseTimelineEvent = (eventId: string) => {
    if (timelineOrder.includes(eventId) || timelineComplete) return;
    const nextExpected = goodmanTrailData.timelineEvents.find((event) => event.order === timelineOrder.length + 1);
    if (nextExpected?.id !== eventId) {
      setTimelineMessage("Close, but the archive needs the earlier event first. Try another card.");
      return;
    }
    const nextOrder = [...timelineOrder, eventId];
    setTimelineOrder(nextOrder);
    if (nextOrder.length === goodmanTrailData.timelineEvents.length) {
      setTimelineMessage("The timeline is rebuilt. The story continued, but the unanswered question remained underneath it all.");
      unlockToken("timeline");
    } else {
      setTimelineMessage(`Good. ${nextOrder.length} of ${goodmanTrailData.timelineEvents.length} events placed.`);
    }
  };

  const chooseRumourPin = (pinId: string) => {
    const nextVisited = { ...visitedRumourPins, [pinId]: true };
    setActiveRumourPin(pinId);
    setVisitedRumourPins(nextVisited);
    if (goodmanTrailData.rumourPins.every((pin) => nextVisited[pin.id])) {
      unlockToken("rumours");
    }
  };

  const advanceChurchStep = () => {
    if (churchStep >= goodmanTrailData.churchSteps.length - 1) {
      unlockToken("grave");
      return;
    }
    const nextStep = churchStep + 1;
    setChurchStep(nextStep);
    if (nextStep === goodmanTrailData.churchSteps.length - 1) {
      unlockToken("grave");
    }
  };

  const chooseLensAnswer = (answer: string) => {
    setLensAnswer(answer);
    if (answer === "All three together") {
      unlockToken("fear");
    }
  };

  const chooseLyric = (lineId: string) => {
    setActiveLyric(lineId);
    const nextDecoded = { ...decodedLyrics, [lineId]: true };
    setDecodedLyrics(nextDecoded);
    if (goodmanTrailData.lyricLines.every((line) => nextDecoded[line.id]) && rhythmTaps >= 8) {
      unlockToken("song");
    }
  };

  const tapRhythm = () => {
    const nextTaps = Math.min(rhythmTaps + 1, 8);
    setRhythmTaps(nextTaps);
    if (nextTaps >= 8 && lyricsComplete) {
      unlockToken("song");
    }
  };

  const placeArchiveObject = (objectId: string) => {
    const nextShelf = shelfObjects.includes(objectId) ? shelfObjects : [...shelfObjects, objectId];
    setShelfObjects(nextShelf);
    if (goodmanTrailData.archiveObjects.every((object) => nextShelf.includes(object.id))) {
      unlockToken("archive");
    }
  };

  return (
    <main className={`goodmanTrailPage ${trailStarted ? "trailStarted" : ""}`} id="goodman-trail">
      <div className="goodmanPosterBackdrop" aria-hidden="true">
        <img src={assetPath("assets/images/goodman-heartman-poster-background.png")} alt="" />
      </div>
      <section className="goodmanTrailHero goodmanOpeningScreen" aria-labelledby="goodman-trail-title">
        <div>
          <h1 id="goodman-trail-title">{goodmanTrailData.title}</h1>
          <p>{goodmanTrailData.subtitle}</p>
          <p>
            Before you read the facts, hear the warning. This trail does not claim to solve the mystery.
            It helps you walk through what survived.
          </p>
        </div>
        <div className="songRevealPanel" aria-live="polite">
          <span>Before the facts, hear the warning</span>
          {goodmanTrailData.openingLines.slice(0, revealedOpeningLines).map((line) => (
            <p key={line}>{line}</p>
          ))}
          {revealedOpeningLines < goodmanTrailData.openingLines.length ? (
            <button type="button" onClick={revealOpeningLine}>
              Reveal next line
            </button>
          ) : (
            <>
              <strong>
                This song carried the story of Goodman from Hillaby into Bajan folk memory. But who was
                Goodman? What happened? And why did the story become a warning?
              </strong>
              <button
                type="button"
                onClick={() => {
                  setTrailStarted(true);
                  document.getElementById("build-man-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Begin the trail
              </button>
            </>
          )}
        </div>
      </section>

      <section className="tokenTray" aria-label="Memory tokens collected">
        {goodmanTrailData.finalTokens.map((token) => (
          <button
            key={token.id}
            type="button"
            className={tokens.includes(token.id) ? "unlocked" : ""}
            aria-pressed={tokens.includes(token.id)}
            onClick={() => setActiveToken(token.id)}
          >
            <span>{tokens.includes(token.id) ? "Unlocked" : "Locked"}</span>
            {token.label}
          </button>
        ))}
      </section>

      <section className="goodmanModule portraitModule" aria-labelledby="build-man-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 1</span>
          <h2 id="build-man-title">Build the Man Before the Mystery</h2>
          <p>
            Start with Archie as a person: a father, worker, neighbour, and Hillaby man. The mystery
            should never flatten him into only what happened.
          </p>
        </div>
        <div className="portraitBuildGrid">
          <article className={`archiePortrait ${portraitComplete ? "complete" : ""}`}>
            <span>Archibald Augustus Alleyn Goodman</span>
            <h3>Archie Goodman</h3>
            <p>
              {portraitComplete
                ? "Archie was not just a mystery. He was a man with work, children, roads, hopes, and a home."
                : "Tap the objects to build the portrait from family memory and supplied research."}
            </p>
            <button type="button" onClick={onOpenHillabyPin}>
              Open Hillaby on the family map
            </button>
          </article>
          <div className="portraitObjectGrid">
            {goodmanTrailData.portraitObjects.map((object) => {
              const isRevealed = Boolean(portraitReveals[object.id]);
              const chosenAnswer = portraitAnswers[object.id];
              return (
                <article key={object.id} className={isRevealed ? "portraitObject revealed" : "portraitObject"}>
                  <button
                    type="button"
                    aria-expanded={isRevealed}
                    onClick={() => revealPortraitObject(object.id)}
                  >
                    {object.label}
                  </button>
                  {isRevealed ? (
                    <>
                      <p>{object.reveal}</p>
                      <strong>{object.question}</strong>
                      <div className="miniAnswerGroup">
                        {object.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={chosenAnswer === option ? "active" : ""}
                            aria-pressed={chosenAnswer === option}
                            onClick={() => answerPortraitQuestion(object.id, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {chosenAnswer ? (
                        <small>
                          {chosenAnswer === object.correct
                            ? "Yes. That is the careful reading."
                            : "Better to treat this more carefully from the material we have."}
                        </small>
                      ) : null}
                    </>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="goodmanModule timelineModule" aria-labelledby="timeline-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 2</span>
          <h2 id="timeline-title">Rebuild the Timeline</h2>
          <p>Tap the cards into order. The aim is not speed; it is seeing how the story continues.</p>
        </div>
        <div className="timelineInteraction">
          <div className="timelineCardPool">
            {shuffledTimeline.map((event) => {
              const placed = timelineOrder.includes(event.id);
              return (
                <button
                  key={event.id}
                  type="button"
                  className={placed ? "placed" : ""}
                  disabled={placed}
                  onClick={() => chooseTimelineEvent(event.id)}
                >
                  <span>{event.date}</span>
                  {event.title}
                </button>
              );
            })}
          </div>
          <article className="rebuiltTimeline">
            <span>{timelineMessage}</span>
            {orderedTimeline.map((event) => (
              <div key={event.id}>
                <strong>{event.date}</strong>
                <p>{event.title}</p>
                <small>{event.detail}</small>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="goodmanModule rumourModule" aria-labelledby="rumour-map-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 3</span>
          <h2 id="rumour-map-title">Follow the Rumour Map</h2>
          <p>Records, testimony, rumours, and legacy all move through places differently.</p>
        </div>
        <div className="rumourMapGrid">
          <div className="rumourMap" aria-label="Goodman rumour map pins">
            {goodmanTrailData.rumourPins.map((pin, index) => (
              <button
                key={pin.id}
                type="button"
                className={`rumourPin rumourPin${index + 1} ${activeRumourPin === pin.id ? "active" : ""}`}
                aria-pressed={activeRumourPin === pin.id}
                onClick={() => chooseRumourPin(pin.id)}
              >
                {pin.place}
              </button>
            ))}
          </div>
          <article className="rumourPinCard" aria-live="polite">
            <span>{activePin.type}</span>
            <h3>{activePin.place}</h3>
            <p>{activePin.detail}</p>
            {rumourComplete ? (
              <strong>
                Rumours move differently from records. Every rumour tells us something about what the
                family and community were trying to understand.
              </strong>
            ) : null}
          </article>
        </div>
      </section>

      <section className="goodmanModule churchyardModule" aria-labelledby="churchyard-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 4</span>
          <h2 id="churchyard-title">The Churchyard Decision Chain</h2>
          <p>This is the most painful lead, so the trail moves slowly and marks uncertainty clearly.</p>
        </div>
        <article className="churchStepCard">
          <span>
            Step {churchStep + 1} of {goodmanTrailData.churchSteps.length}
          </span>
          <h3>{goodmanTrailData.churchSteps[churchStep].title}</h3>
          <p>{goodmanTrailData.churchSteps[churchStep].text}</p>
          {churchStep === 2 ? (
            <div className="delayMeter" aria-label="Delay meter">
              <div style={{ width: "100%" }} />
              <p>Day passes. The family waits. The grave remains closed. The answer may be slipping away.</p>
            </div>
          ) : null}
          {churchStep === 3 ? (
            <div className="miniAnswerGroup">
              {["Final proof", "Painful testimony", "Something to treat carefully"].map((answer) => (
                <button
                  key={answer}
                  type="button"
                  className={churchAnswer === answer ? "active" : ""}
                  aria-pressed={churchAnswer === answer}
                  onClick={() => setChurchAnswer(answer)}
                >
                  {answer}
                </button>
              ))}
            </div>
          ) : null}
          {churchAnswer ? (
            <strong>
              {churchAnswer === "Something to treat carefully"
                ? "Yes. It matters, but it is not final proof."
                : "The safer archive language is: this is testimony to treat carefully."}
            </strong>
          ) : null}
          <button type="button" onClick={advanceChurchStep}>
            {goodmanTrailData.churchSteps[churchStep].action}
          </button>
        </article>
      </section>

      <section className="goodmanModule lensModule" aria-labelledby="folklore-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 5</span>
          <h2 id="folklore-title">Decode the Folklore Layer</h2>
          <p>Choose a lens. The story is strongest when grief, fear, and power are held together.</p>
        </div>
        <div className="lensGrid">
          {goodmanTrailData.lenses.map((lens) => (
            <button
              key={lens.id}
              type="button"
              className={activeLens === lens.id ? "active" : ""}
              aria-pressed={activeLens === lens.id}
              onClick={() => setActiveLens(lens.id)}
            >
              {lens.title}
            </button>
          ))}
        </div>
        <article className="lensCard">
          <h3>{activeLensCard.title}</h3>
          <p>{activeLensCard.text}</p>
          <strong>{activeLensCard.keySentence}</strong>
        </article>
        <div className="miniAnswerGroup">
          {["Family grief", "Folk fear", "Suspicion of power", "All three together"].map((answer) => (
            <button
              key={answer}
              type="button"
              className={lensAnswer === answer ? "active" : ""}
              aria-pressed={lensAnswer === answer}
              onClick={() => chooseLensAnswer(answer)}
            >
              {answer}
            </button>
          ))}
        </div>
      </section>

      <section className="goodmanModule songModule" aria-labelledby="song-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 6</span>
          <h2 id="song-title">Play the Song / Read the Warning</h2>
          <p>Decode the lyrics, then tap the rhythm. The song is cultural memory, not legal proof.</p>
        </div>
        <div className="songDecodeGrid">
          <div className="songLines" aria-label="Lyric decoder">
            {goodmanTrailData.lyricLines.map((line) => (
              <button
                key={line.id}
                type="button"
                className={activeLyric === line.id ? "songLineButton active" : "songLineButton"}
                aria-expanded={activeLyric === line.id}
                onClick={() => chooseLyric(line.id)}
              >
                <strong>{line.lyric}</strong>
              </button>
            ))}
          </div>
          <article className="songMeaningCard" aria-live="polite">
            <span>Lyric decoder</span>
            <h3>{activeLyricCard.lyric}</h3>
            <p>{activeLyricCard.meaning}</p>
            <div className="rhythmPanel">
              <button type="button" onClick={tapRhythm}>
                Tap the Tuk rhythm
              </button>
              <meter min="0" max="8" value={rhythmTaps}>
                {rhythmTaps} of 8 taps
              </meter>
              <small>{rhythmTaps} / 8 taps</small>
              {rhythmTaps >= 8 ? (
                <strong>
                  The song is recorded in E Major with a lively syncopated rhythm linked to Barbadian
                  Tuk band style. A dark story survived inside a rhythm people could repeat.
                </strong>
              ) : null}
            </div>
            <div className="songRecordingGrid" aria-label="Goodman song recordings">
              {goodmanTrailData.songRecordings.map((recording) => (
                <TrailSongPlayer
                  key={recording.id}
                  title={recording.title}
                  description={recording.description}
                  src={recording.src}
                />
              ))}
            </div>
            <div className="goodmanClosingActions">
              <button type="button" onClick={() => setRevealedOpeningLines(goodmanTrailData.openingLines.length)}>
                Read lyrics only
              </button>
              <button type="button" onClick={() => setCaseActionMessage("TODO: attach the song sheet scan.")}>
                View song sheet
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="goodmanModule archiveModule" aria-labelledby="archive-title">
        <div className="goodmanModuleIntro">
          <span>Chapter 7</span>
          <h2 id="archive-title">Restore the Archive</h2>
          <p>Place each object onto the shelf. Together, they become the family inheritance.</p>
        </div>
        <div className="archiveShelfGrid">
          <div className="archiveObjectPool">
            {goodmanTrailData.archiveObjects.map((object) => (
              <button
                key={object.id}
                type="button"
                className={shelfObjects.includes(object.id) ? "placed" : ""}
                disabled={shelfObjects.includes(object.id)}
                onClick={() => placeArchiveObject(object.id)}
              >
                {object.label}
              </button>
            ))}
          </div>
          <article className="archiveShelf">
            <span>Digital archive shelf</span>
            {goodmanTrailData.archiveObjects
              .filter((object) => shelfObjects.includes(object.id))
              .map((object) => (
                <div key={object.id}>
                  <strong>{object.label}</strong>
                  <p>{object.reveal}</p>
                </div>
              ))}
            {shelfComplete ? (
              <strong>
                Springvale later became an Eco-Heritage Museum preserving working-class Barbadian life,
                traditional trades, household objects, rare documents, and Scotland District memory.
              </strong>
            ) : null}
          </article>
        </div>
      </section>

      <section className="goodmanModule memoryTableModule" aria-labelledby="memory-table-title">
        <div className="goodmanModuleIntro">
          <span>Final screen</span>
          <h2 id="memory-table-title">The Memory Table</h2>
          <p>
            {allTokensCollected
              ? "The seven tokens now form the table."
              : `${tokens.length} of ${goodmanTrailData.finalTokens.length} memory tokens collected.`}
          </p>
        </div>
        <div className="memoryTableGrid">
          <div className="memoryTokenList">
            {goodmanTrailData.finalTokens.map((token) => (
              <button
                key={token.id}
                type="button"
                className={activeToken === token.id ? "active" : ""}
                disabled={!tokens.includes(token.id)}
                onClick={() => setActiveToken(token.id)}
              >
                {tokens.includes(token.id) ? token.label : `${token.label} - locked`}
              </button>
            ))}
          </div>
          <article className="memoryTokenLesson">
            <h3>{tokens.includes(activeFinalToken.id) ? activeFinalToken.label : "Keep walking the trail"}</h3>
            <p>
              {tokens.includes(activeFinalToken.id)
                ? activeFinalToken.lesson
                : "Complete the mini-interactions to unlock this part of the memory table."}
            </p>
            <strong>
              The Goodman mystery is not only about what happened to Archie. It is about how a family
              kept carrying him.
            </strong>
            <div className="goodmanClosingActions">
              <button
                type="button"
                onClick={() => setCaseActionMessage("TODO: connect this button to a private family memory form.")}
              >
                Leave a family memory
              </button>
              <button
                type="button"
                onClick={() => setCaseActionMessage("TODO: connect this button to a private contact route.")}
              >
                I know something about this story
              </button>
              <button type="button" onClick={() => setCaseActionMessage("TODO: connect audio when ready.")}>
                Listen to the song
              </button>
              <button type="button" onClick={() => setCaseActionMessage("TODO: attach the article scan.")}>
                View the article
              </button>
              <button type="button" onClick={() => setCaseActionMessage("TODO: attach the song sheet scan.")}>
                View the song sheet
              </button>
              <button type="button" onClick={onReturnToMap}>
                Return to the map
              </button>
            </div>
            {caseActionMessage ? <small aria-live="polite">{caseActionMessage}</small> : null}
          </article>
        </div>
      </section>
    </main>
  );
}
