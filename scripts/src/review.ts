import { reviewFile } from "./claude.js";
import { getExistingBotCommentKeys, getPRFiles, postReview, postSummary } from "./github.js";
import type { ReviewComment } from "./types.js";

async function main() {
  const allFiles = await getPRFiles();
  const files = allFiles.filter(
    (f) => !f.filename.startsWith("scripts/") && !f.filename.startsWith("preprocessing/")
  );
  console.log(`Reviewing ${files.length} file(s) (${allFiles.length - files.length} skipped)...`);

  const allComments: ReviewComment[] = [];

  for (const file of files) {
    console.log(`  - ${file.filename}`);
    try {
      const comments = await reviewFile(file);
      allComments.push(...comments);
    } catch (err) {
      console.error(`Failed to review ${file.filename}:`, err);
    }
  }

  const existingKeys = await getExistingBotCommentKeys();
  const newComments = allComments.filter(
    (c) => !existingKeys.has(`${c.path}:${c.line}:${c.body}`)
  );

  if (existingKeys.size > 0) {
    console.log(`Skipping ${allComments.length - newComments.length} already-commented line(s).`);
  }

  await postReview(newComments);
  await postSummary(newComments, files.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
