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
    return "Wuh loss, welcome. I can help with Nana's Barbados, the BODA constitution, the memory map, the 360 journey, or adding your own family pin.";
  }

  if (hasAny(cleanQuestion, ["boda", "constitution", "aim", "objective", "association", "mission"])) {
    return "BODA stands for Barbados Overseas Descendants Association. Its constitution focuses on Barbadian culture, festivals, arts, healthy living, mentoring, relief from hardship and isolation, and community cohesion. It is non-profit, non-partisan, non-sectarian, and works against discrimination. In this app, that connects directly to helping families turn heritage into living contributions.";
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
    const heritageMemory =
      context.memories.find((memory) => memory.id === "family-heritage") ?? context.activeMemory ?? context.memories[0];
    return `${describeMemory(heritageMemory)} The bigger point is that visitors should not only observe heritage. They should be able to add their own family places, voices and photos too.`;
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
    return "You are on the About BODA page. This page explains the constitution: BODA's name, aims, inclusive principles, membership, officers, finance, meetings and governance.";
  }

  if (context.page === "contribute") {
    return "You are on the Add your pin page. Start by dropping the pin on the map, then add the memory title, place note, story, tags, and any picture or voice note you want to keep with it.";
  }

  return "I can answer from the built-in BODA and Nana memory map content on this GitHub Pages version. Try asking about BODA's aims, Nana's village, the 360 journey, heritage, parish pins, voice notes, or adding your own memory.";
};
