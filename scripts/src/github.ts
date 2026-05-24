import { Octokit } from "@octokit/rest";
import { IGNORED_FILES } from "./constants.js";
import type { DiffFile, ReviewComment } from "./types.js";

export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const repoName = process.env.REPO_NAME ?? "";
if (!repoName.includes("/")) {
  throw new Error(`REPO_NAME must be in "owner/repo" format, got: "${repoName}"`);
}
export const [owner, repo] = repoName.split("/");
export const prNumber = parseInt(process.env.PR_NUMBER ?? "0", 10);
export const commitSha = process.env.COMMIT_SHA ?? "";
const beforeSha = process.env.BEFORE_SHA ?? "";
const eventAction = process.env.EVENT_ACTION ?? "opened";

export function parseValidLines(patch: string): Set<number> {
  const valid = new Set<number>();
  let currentLine = 0;
  for (const line of patch.split("\n")) {
    const hunkHeader = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
    if (hunkHeader) {
      currentLine = parseInt(hunkHeader[1], 10);
      continue;
    }
    if (line.startsWith("-")) continue;
    valid.add(currentLine);
    currentLine++;
  }
  return valid;
}

function toDiffFiles(files: { filename: string; patch?: string }[]): DiffFile[] {
  return files
    .filter((f) => !f.filename.match(IGNORED_FILES))
    .filter((f) => f.patch !== undefined)
    .map((f) => ({
      filename: f.filename,
      patch: f.patch!,
      validLines: parseValidLines(f.patch!),
    }));
}

export async function getPRFiles(): Promise<DiffFile[]> {
  if (
    eventAction === "synchronize" &&
    beforeSha &&
    beforeSha !== "0000000000000000000000000000000000000000"
  ) {
    const { data } = await octokit.repos.compareCommits({
      owner,
      repo,
      base: beforeSha,
      head: commitSha,
    });
    return toDiffFiles(data.files ?? []);
  }

  const files = await octokit.paginate(octokit.pulls.listFiles, {
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100,
  });
  return toDiffFiles(files);
}

export async function getExistingBotCommentKeys(): Promise<Set<string>> {
  const comments = await octokit.paginate(octokit.pulls.listReviewComments, {
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100,
  });
  return new Set(
    comments
      .filter((c) => c.user?.login === "github-actions[bot]" && c.line != null)
      .map((c) => `${c.path}:${c.line}`)
  );
}

export async function postSummary(comments: ReviewComment[], filesReviewed: number) {
  const byFile = comments.reduce<Record<string, number>>((acc, c) => {
    acc[c.path] = (acc[c.path] ?? 0) + 1;
    return acc;
  }, {});

  let body: string;
  if (comments.length === 0) {
    body = `## AI Code Review\n\nNo issues found across ${filesReviewed} reviewed file(s).`;
  } else {
    const fileLines = Object.entries(byFile)
      .map(([path, count]) => `- \`${path}\` — ${count} issue(s)`)
      .join("\n");
    body = `## AI Code Review\n\nFound **${comments.length} issue(s)** across **${Object.keys(byFile).length} file(s)**:\n\n${fileLines}`;
  }

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  });
}

export async function postReview(comments: ReviewComment[]) {
  if (comments.length === 0) {
    console.log("No comments to post.");
    return;
  }

  try {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      commit_id: commitSha,
      event: "COMMENT",
      comments: comments.map((c) => ({ path: c.path, line: c.line, body: c.body })),
    });
    console.log(`Posted ${comments.length} review comment(s).`);
  } catch {
    console.error("Batch review failed, retrying comments individually...");
    let posted = 0;
    for (const c of comments) {
      try {
        await octokit.pulls.createReview({
          owner,
          repo,
          pull_number: prNumber,
          commit_id: commitSha,
          event: "COMMENT",
          comments: [{ path: c.path, line: c.line, body: c.body }],
        });
        posted++;
      } catch (innerErr) {
        console.error(`Failed to post comment on ${c.path}:${c.line}:`, innerErr);
      }
    }
    console.log(`Posted ${posted}/${comments.length} comment(s) individually.`);
  }
}
