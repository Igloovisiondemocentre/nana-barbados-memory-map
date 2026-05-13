const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

const getEnv = (name) => globalThis.Netlify?.env?.get?.(name) ?? globalThis.process?.env?.[name];

const systemPrompt = `
You are the BODA Strategy / Diaspora Connector helper inside Nana's Barbados Memory Map.
Speak warmly and practically to families, children, educators, and diaspora visitors.
Use light Bajan flavour only where it feels natural; do not overdo dialect or parody it.
Help users understand Barbados, Nana's memories, family heritage, archives, migration, village life,
education, sugar history, and how diaspora families can preserve stories.
Keep answers concise, educational, kind, and grounded. If you are unsure, say so and suggest a next research step.
Do not invent exact family facts, records, or locations. Encourage checking elders, archives, certificates, land records, and source notes.
`;

const cleanMessages = (messages) =>
  messages
    .filter((message) => message && ["user", "assistant"].includes(message.role))
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: String(message.content ?? "").slice(0, 1200),
    }))
    .filter((message) => message.content.trim().length > 0);

const extractText = (responseBody) => {
  if (typeof responseBody.output_text === "string") {
    return responseBody.output_text.trim();
  }

  const text = responseBody.output
    ?.flatMap((item) => item.content ?? [])
    ?.map((content) => content.text)
    ?.filter(Boolean)
    ?.join("\n");

  return text?.trim() || "";
};

export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = getEnv("OPENAI_API_KEY");
  if (!apiKey) {
    return json({ error: "Chat is not configured yet. Add OPENAI_API_KEY in Netlify." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const messages = cleanMessages(body.messages ?? []);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json({ error: "Send at least one user message." }, 400);
  }

  const model = getEnv("OPENAI_MODEL") || "gpt-5-mini";

  const input = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: systemPrompt.trim(),
        input,
        max_output_tokens: 420,
        store: false,
      }),
    });

    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = responseBody.error?.message || "OpenAI request failed.";
      return json({ error: message }, response.status);
    }

    const reply = extractText(responseBody);
    if (!reply) {
      return json({ error: "The model returned an empty response." }, 502);
    }

    return json({ reply });
  } catch {
    return json({ error: "Could not reach the chat service." }, 502);
  }
};

export const config = {
  path: "/api/boda-chat",
  method: ["POST", "OPTIONS"],
};
