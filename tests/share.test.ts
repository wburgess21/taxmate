/**
 * Share messages: every calculator has one, written to fit an X post with the link (a link counts as 23 characters,
 * so ~110 leaves room for the person to add a few words). Read from the source text, as lib/calculators.ts uses
 * extensionless imports that Node's test runner can't follow.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../lib/calculators.ts", import.meta.url), "utf8");
const slugs = [...src.matchAll(/^ {4}slug: "([^"]+)",\n {4}share: "([^"]*)",/gm)].map((m) => ({ slug: m[1], share: m[2] }));

test("Every calculator has a short share message", () => {
  assert.equal(slugs.length, (src.match(/^ {4}slug: "/gm) ?? []).length, "a calculator is missing its share message");
  for (const { slug, share } of slugs) {
    assert.ok(share.trim().length > 20, `${slug}: share message missing`);
    assert.ok(share.length <= 110, `${slug}: share message is ${share.length} characters`);
    assert.ok(!/[.:]$/.test(share), `${slug}: share message shouldn't end in punctuation (a link follows it)`);
  }
});
