export type EvidenceCategory = "Known Record" | "Family Testimony" | "Rumour / Folklore" | "Still Unresolved";

export type MemoryTokenId = "song" | "man" | "timeline" | "rumours" | "grave" | "fear" | "archive";

export const evidenceCategories: EvidenceCategory[] = [
  "Known Record",
  "Family Testimony",
  "Rumour / Folklore",
  "Still Unresolved",
];

export const goodmanTrailData = {
  title: "Goodman of Hillaby",
  subtitle: "A family mystery remembered through song, silence, folklore, and land.",
  openingLines: [
    "Yuh betta do good as to do bad.",
    "Fuh dey kill Goodman from Hillaby,",
    "An' dey t'ink nobody don' know,",
    "Yuh betta watch yuh step when yuh go down dey,",
    "An' see dat dey don' kill you.",
  ],
  portraitObjects: [
    {
      id: "bicycle",
      label: "Bicycle",
      reveal:
        "Archie did not own a car. He was remembered as travelling through the rugged Scotland District by bicycle.",
      question: "What does this tell us about his daily life?",
      options: ["He was connected to the land and roads.", "He lived far from everyone.", "He avoided people."],
      correct: "He was connected to the land and roads.",
    },
    {
      id: "work-badge",
      label: "Work badge",
      reveal: "Archie worked as one of the managers at the British Union Oil Company.",
      question: "Why does this matter?",
      options: ["It shows he had a respected working position.", "It proves he was wealthy.", "It explains everything about the mystery."],
      correct: "It shows he had a respected working position.",
    },
    {
      id: "schoolbook",
      label: "Schoolbook",
      reveal:
        "Archie sent his daughter Iris to Queen's College in 1926. Her school fee was $21.20 per term, and she boarded at Ocean View Road with his cousin Mrs. Agard.",
      question: "What does this reveal about Archie?",
      options: ["He invested in his daughter's future.", "He did not care about education.", "He only cared about work."],
      correct: "He invested in his daughter's future.",
    },
    {
      id: "family-home",
      label: "Family home",
      reveal:
        "Archie and his wife Ella Goodman had seven children: five boys and two girls. Frank was about 19 at the time of the tragedy, and Iris was born on June 30, 1913.",
      question: "What was lost when Archie disappeared?",
      options: ["Only one man.", "A father, husband, provider, and family anchor.", "A stranger from the village."],
      correct: "A father, husband, provider, and family anchor.",
    },
    {
      id: "hillaby-pin",
      label: "Hillaby map pin",
      reveal: "Archie lived in Hillaby, St. Andrew, in Barbados's Scotland District.",
      question: "What does Hillaby give this story?",
      options: ["A rooted place.", "A solved ending.", "A reason to forget."],
      correct: "A rooted place.",
    },
  ],
  timelineEvents: [
    {
      id: "queens-college",
      date: "1926",
      title: "Iris enters Queen's College",
      detail: "A sign of Archie's investment in education and social mobility.",
      order: 1,
    },
    {
      id: "archie-disappears",
      date: "March 16, 1936",
      title: "Archie disappears",
      detail: "Archibald Augustus Alleyn Goodman vanishes from Hillaby, St. Andrew.",
      order: 2,
    },
    {
      id: "gill-sighting",
      date: "March 17, 1936",
      title: "Mr. Gill sees a dim light and vehicle",
      detail: "The reported movement toward St. Andrew's Church becomes a troubling lead.",
      order: 3,
    },
    {
      id: "iris-rufus",
      date: "November 14, 1936",
      title: "Iris marries Rufus Cave Greenidge",
      detail: "Family life continues while the unanswered question remains.",
      order: 4,
    },
    {
      id: "cyrillene-born",
      date: "March 8, 1937",
      title: "Cyrillene is born",
      detail: "Archie's first grandchild is born almost one year after his disappearance.",
      order: 5,
    },
    {
      id: "springvale-purchase",
      date: "1963",
      title: "Rufus buys Springvale Plantation",
      detail: "The family re-establishes a deep presence in the Scotland District.",
      order: 6,
    },
    {
      id: "springvale-museum",
      date: "After 1986",
      title: "Springvale becomes an Eco-Heritage Museum",
      detail: "Newlands and Denyse Greenidge help turn family land into a heritage archive.",
      order: 7,
    },
  ],
  rumourPins: [
    {
      id: "hillaby",
      place: "Hillaby",
      type: "Recorded place / family memory",
      detail: "Hillaby is the village tied to Goodman in both the family story and the song.",
    },
    {
      id: "st-george",
      place: "St. George",
      type: "Rumour",
      detail:
        "One rumour claimed Archie had been seen \"up St. George running the children.\" This connects the story to the darker Barbadian Heartman myth, where fear of missing people and child-hunting figures entered folklore.",
    },
    {
      id: "turners-hill",
      place: "Turners Hill",
      type: "Witness testimony",
      detail:
        "Mr. Gill, manager of Turners Hill, reportedly saw a dim light and vehicle moving toward St. Andrew's Church on the Tuesday night after Archie disappeared.",
    },
    {
      id: "st-andrew-church",
      place: "St. Andrew's Church",
      type: "Churchyard lead",
      detail: "The churchyard became the centre of the most troubling lead: the one-foot pauper's grave.",
    },
    {
      id: "springvale",
      place: "Springvale",
      type: "Legacy",
      detail:
        "In 1963, Rufus Greenidge bought Springvale Plantation, later connected to the family's heritage preservation.",
    },
  ],
  churchSteps: [
    {
      title: "A dim light at Turners Hill",
      text: "Mr. Gill reported seeing a dim light and a vehicle moving through the yard toward St. Andrew's Church.",
      action: "Follow the vehicle",
    },
    {
      title: "The one-foot pauper's grave",
      text:
        "A rumour formed that Archie's body had been placed in a grave on top of a one-legged pauper from the Almshouse. The rector confirmed that a one-legged pauper had been buried there.",
      action: "Try to open the grave",
    },
    {
      title: "Permission denied",
      text:
        "The grave could not be opened immediately because permission was needed from Bishop Bentley, who was out of the island.",
      action: "Continue waiting",
    },
    {
      title: "Freshly disturbed mould",
      text:
        "When police finally came, nothing was found. According to the account, the soil looked freshly disturbed, and a stick passed down into the grave.",
      action: "Treat the clue carefully",
    },
    {
      title: "The lost answer",
      text:
        "This is why the churchyard account hurts: it feels like the family came close to an answer, but the moment passed.",
      action: "Carry the memory",
    },
  ],
  lenses: [
    {
      id: "family",
      title: "Family Lens",
      text: "For the family, the story is grief, memory, and an unanswered disappearance.",
      keySentence: "Iris did not need a theory. She needed closure.",
    },
    {
      id: "folklore",
      title: "Folklore Lens",
      text:
        "The song source connects the story to Bajan fears around Secret Orders, black magic, necromancy, missing persons, and the Heartman myth.",
      keySentence: "When official answers fail, folklore gives fear a shape.",
    },
    {
      id: "power",
      title: "Power Lens",
      text:
        "The supplied analysis frames the story as part of wider anxieties about elite secrecy, colonial class structures, and the suspicion that powerful people could act without consequence.",
      keySentence: "Sometimes folklore is not just superstition. Sometimes it is how ordinary people talk about power.",
    },
  ],
  lyricLines: [
    {
      id: "do-good",
      lyric: "Yuh betta do good as to do bad.",
      meaning: "The moral warning: do good rather than wrong.",
    },
    {
      id: "goodman-hillaby",
      lyric: "Fuh dey kill Goodman from Hillaby.",
      meaning: "The line that names Goodman and Hillaby. Powerful folk memory, not legal proof.",
    },
    {
      id: "nobody-know",
      lyric: "An' dey t'ink nobody don' know.",
      meaning: "The feeling that hidden truth exists somewhere.",
    },
    {
      id: "watch-step",
      lyric: "Yuh betta watch yuh step when yuh go down dey.",
      meaning: "The warning becomes attached to place.",
    },
    {
      id: "dont-kill-you",
      lyric: "An' see dat dey don' kill you.",
      meaning: "The story becomes survival advice.",
    },
  ],
  songRecordings: [
    {
      id: "voice-note",
      title: "Yuh Betta Do Good - voice note",
      description: "A short family recording, trimmed and volume-levelled for the trail.",
      src: "assets/audio/goodman-yuh-betta-do-good-voice-note.mp3",
    },
    {
      id: "archive-take-1",
      title: "Yuh Betta Do Good - archive take 1",
      description: "First separated take from the longer archive recording.",
      src: "assets/audio/goodman-yuh-betta-do-good-archive-take-1.mp3",
    },
    {
      id: "archive-take-2",
      title: "Yuh Betta Do Good - archive take 2",
      description: "Second separated take from the longer archive recording.",
      src: "assets/audio/goodman-yuh-betta-do-good-archive-take-2.mp3",
    },
  ],
  archiveObjects: [
    {
      id: "bicycle",
      label: "Bicycle",
      reveal: "Archie as father and everyday man.",
    },
    {
      id: "schoolbook",
      label: "Schoolbook",
      reveal: "Iris's education and Archie's investment in her future.",
    },
    {
      id: "song-sheet",
      label: "Song sheet",
      reveal: "The story preserved through Bajan folk memory.",
    },
    {
      id: "churchyard-stone",
      label: "Churchyard stone",
      reveal: "The painful search for answers.",
    },
    {
      id: "springvale-leaf",
      label: "Springvale leaf",
      reveal: "Return to land and legacy.",
    },
    {
      id: "family-photo",
      label: "Family photo",
      reveal: "The descendants who carry the story now.",
    },
  ],
  finalTokens: [
    {
      id: "song" as MemoryTokenId,
      label: "The Song",
      lesson: "The warning remembered Goodman from Hillaby.",
    },
    {
      id: "man" as MemoryTokenId,
      label: "The Man",
      lesson: "Archie was a father, husband, worker, and respected member of Hillaby.",
    },
    {
      id: "timeline" as MemoryTokenId,
      label: "The Timeline",
      lesson: "The disappearance happened in 1936, but the story continued through marriage, children, land, and memory.",
    },
    {
      id: "rumours" as MemoryTokenId,
      label: "The Rumours",
      lesson: "When facts were missing, rumours filled the silence.",
    },
    {
      id: "grave" as MemoryTokenId,
      label: "The Grave",
      lesson: "The churchyard lead became the most painful missed answer.",
    },
    {
      id: "fear" as MemoryTokenId,
      label: "The Fear",
      lesson: "Heartman and Secret Order folklore show how the community tried to explain terror, secrecy, and power.",
    },
    {
      id: "archive" as MemoryTokenId,
      label: "The Archive",
      lesson: "Through Iris, Rufus, Newlands, Denyse, Springvale, and the family, the story became preservation.",
    },
  ],
};
