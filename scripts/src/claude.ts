import Anthropic from "@anthropic-ai/sdk";
import { MODEL, REVIEW_INSTRUCTIONS } from "./constants.js";
import type { DiffFile, ReviewComment } from "./types.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function reviewFile(file: DiffFile): Promise<ReviewComment[]> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: REVIEW_INSTRUCTIONS,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `File: ${file.filename}\n\nDiff:\n${file.patch}`,
      },
    ],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "[]";
  const text = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  let comments: ReviewComment[];
  try {
    comments = JSON.parse(text) as ReviewComment[];
  } catch {
    console.error(`Failed to parse response for ${file.filename}:`, text);
    return [];
  }

  return comments.filter((c) => {
    if (c.path !== file.filename) {
      console.warn(`Dropping comment with mismatched path: ${c.path}`);
      return false;
    }
    if (!file.validLines.has(c.line)) {
      console.warn(`Dropping comment on invalid line ${c.line} in ${file.filename}`);
      return false;
    }
    return true;
  });
}
