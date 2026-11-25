// post-x-promote-make-your-own-bounty-01 entry program.
//
// Copies POST.json from the repository root into the grader's output
// directory. That is the whole job: the house reads the X post itself
// from the URL inside POST.json, so nothing written here about the post
// counts toward the score.
//
// Environment (same names the make.fun kit uses):
//   MAKEFUN_BOT_DIR     - repository root (defaults to the current directory)
//   MAKEFUN_OUTPUT_DIR  - output directory (defaults to "out")
import { copyFile, mkdir, chmod, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const botDir = resolve(process.env.MAKEFUN_BOT_DIR ?? ".");
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "out");

const source = join(botDir, "POST.json");
const target = join(outputDir, "POST.json");

// Fail loudly (instead of copying a broken file) when POST.json is not
// a JSON object with a url string in it.
const parsed = JSON.parse(await readFile(source, "utf8"));
if (typeof parsed !== "object" || parsed === null || typeof parsed.url !== "string") {
  throw new Error("POST.json must be a JSON object with a string \"url\" field");
}

await mkdir(outputDir, { recursive: true });
await copyFile(source, target);
// The grader collects outputs as another user: leave the file readable.
await chmod(target, 0o644);
