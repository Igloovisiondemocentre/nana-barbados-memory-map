import type { MemoryPoint } from "../types";

type LocalBodaChatContext = {
  memories: MemoryPoint[];
  userPinCount: number;
  activeMemory?: MemoryPoint;
  page: "map" | "boda" | "contribute";
};

const stopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "can",
  "did",
  "does",
  "for",
  "from",
  "how",
  "into",
  "like",
  "map",
  "nana",
  "that",
  "the",
  "there",
  "this",
  "was",
  "what",
  "when",
  "where",
  "with",
  "you",
  "your",
]);

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

const hasAny = (question: string, words: string[]) => words.some((word) => question.includes(word));

const getQuestionTokens = (question: string) =>
  normalise(question)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));

const scoreMemory = (memory: MemoryPoint, tokens: string[]) => {
  const haystack = normalise(
    [
      memory.title,
      memory.childSubtitle,
      memory.region,
      memory.viewName,
      memory.description,
      ...memory.familyTags,
    ].join(" "),
  );
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
};

const describeMemory = (memory: MemoryPoint) =>
  `${memory.title} is linked to ${memory.region}. ${memory.description}`;

export const getLocalBodaChatReply = (question: string, context: LocalBodaChatContext) => {
  const cleanQuestion = normalise(question);

  if (hasAny(cleanQuestion, ["hello", "hi ", "hey", "morning", "evening"])) {
    return "Wuh loss, welcome. I can help with Nana's Barbados map, the BODA constitution, BOWL history, Barbados references, the 360 journey, or adding your own Nana-site family pin.";
  }

  if (hasAny(cleanQuestion, ["boda", "constitution", "aim", "objective", "association", "mission"])) {
    return "BODA stands for Barbados Overseas Descendants Association. Its organisation work belongs separately from the private Nana family archive. BODA's constitution focuses on Barbadian culture, festivals, arts, healthy living, mentoring, relief from hardship and isolation, and community cohesion. It is non-profit, non-partisan, non-sectarian, and works against discrimination.";
  }

  if (hasAny(cleanQuestion, ["bowl", "cook it right", "cook", "diabetes", "hypertension", "quadrille", "warri", "olympiad"])) {
    return "BOWL, the Barbados Overseas Women's Link, is the organisation legacy behind BODA. Its work included Cook It Right health education, diabetes and hypertension awareness, Warri, quadrille, Old Time Barbados displays, fundraising, and youth cultural programmes. Those belong in the BODA organisation story.";
  }

  if (hasAny(cleanQuestion, ["book", "books", "heroes", "folklore", "constitution", "place names", "places"])) {
    return "The BODA organisation site can use Barbados-wide resources: the Constitution booklet, National Heroes material, folklore resources, historical guides, place-name references and culture booklets. Private family stories and pins stay on the Nana website.";
  }

  if (hasAny(cleanQuestion, ["pin", "pins", "add", "parish", "village", "photo", "picture", "voice", "audio", "contribute"])) {
    return `Use Menu, then Add your pin. You can tap or drag the pin onto Barbados, add whose memory it is, add a place note like a village, road, school or church, write the story, and optionally add a picture or voice note. This version allows 5 personal pins and you have used ${context.userPinCount}/5. The pin is saved on this device and appears on the memory map.`;
  }

  if (hasAny(cleanQuestion, ["street", "streetview", "street view", "google", "360"])) {
    return "The 360 journey starts from Enter 360. On mobile, the information is tucked into side tabs so the view stays immersive. For personal pins, the app creates a nearby Google Street View point from where you drop the pin on the Barbados map.";
  }

  if (hasAny(cleanQuestion, ["share", "result", "send"])) {
    return "On the Add your pin page, use Share result after you have saved at least one personal pin. The app will open the device share sheet when available, or copy share text to the clipboard.";
  }

  if (hasAny(cleanQuestion, ["meg", "goodman", "family", "roots", "heritage"])) {
    return "Family history belongs on the Nana website and family layer, not inside the BODA organisation knowledge. Use the map's family layer for people, stories, locations and research pins, and keep BODA focused on the association, BOWL legacy, constitution and Barbados-wide learning.";
  }

  const tokens = getQuestionTokens(question);
  const matches = context.memories
    .map((memory) => ({ memory, score: scoreMemory(memory, tokens) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (matches.length > 0) {
    const memoryText = matches.map(({ memory }) => describeMemory(memory)).join(" ");
    return `${memoryText} Tap the related map pin or Enter 360 to explore it in context.`;
  }

  if (context.page === "boda") {
    return "You are on the About BODA page. This page explains BODA's organisation identity: the constitution, BOWL legacy, Cook It Right, cultural programmes, membership, officers, finance, meetings and governance.";
  }

  if (context.page === "contribute") {
    return "You are on the Add your pin page. Start by dropping the pin on the map, then add the memory title, place note, story, tags, and any picture or voice note you want to keep with it.";
  }

  return "I can answer from the built-in BODA and Nana memory map content on this GitHub Pages version. Try asking about BODA's aims, Nana's village, the 360 journey, heritage, parish pins, voice notes, or adding your own memory.";
};
