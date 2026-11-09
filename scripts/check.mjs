import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, "site.config.js"), "utf8"), context, { timeout: 1000 });
const data = context.window.SITE_DATA;
const string = (value, field, required = false) => assert(typeof value === "string" && (!required || value.trim()), `${field} must be ${required ? "a nonempty" : "a"} string.`);
const array = (value, field) => assert(Array.isArray(value), `${field} must be an array.`);

async function url(value, field) {
  string(value, field);
  if (!value) return;
  const resolved = new URL(value, "https://homepage.invalid/");
  assert(["http:", "https:", "mailto:"].includes(resolved.protocol), `${field}: unsupported URL protocol.`);
  if (!/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith("//")) {
    assert(!value.startsWith("/"), `${field}: use relative asset paths so project GitHub Pages sites work.`);
    const local = path.resolve(root, decodeURIComponent(resolved.pathname.slice(1)));
    const relative = path.relative(root, local);
    assert(!relative.startsWith("..") && !path.isAbsolute(relative), `${field}: asset must stay inside the project.`);
    await access(local);
  }
}

assert(data && data.profile && data.about && data.research && data.publications && data.footer, "Missing configuration section.");
for (const key of ["name", "nativeName", "initials", "role", "department", "affiliation", "location", "email", "note"]) string(data.profile[key], `profile.${key}`, key === "name");
for (const key of ["avatar", "cv"]) await url(data.profile[key], `profile.${key}`);
array(data.profile.links, "profile.links");
for (const item of data.profile.links) { string(item.label, "profile link label", true); await url(item.href, "profile link"); }
string(data.about.title, "about.title", true);
array(data.about.paragraphs, "about.paragraphs");
for (const paragraph of data.about.paragraphs) string(paragraph, "about paragraph");
array(data.about.news, "about.news");
for (const item of data.about.news) { string(item.date, "news date"); string(item.text, "news text"); }
string(data.research.intro, "research.intro");
array(data.research.items, "research.items");
for (const item of data.research.items) { string(item.title, "research title", true); string(item.description, "research description"); }
string(data.publications.note, "publications.note");
array(data.publications.items, "publications.items");
const ids = new Set();
for (const paper of data.publications.items) {
  string(paper.id, "publication id", true);
  assert(!ids.has(paper.id), `Duplicate publication id: ${paper.id}`);
  ids.add(paper.id);
  assert(Number.isInteger(paper.year) && paper.year > 1900 && paper.year < 2200, `${paper.id}: year must be a valid integer.`);
  for (const key of ["title", "venue"]) string(paper[key], `${paper.id}.${key}`, true);
  for (const key of ["venueShort", "summary", "bibtex"]) if (paper[key] !== undefined) string(paper[key], `${paper.id}.${key}`);
  array(paper.authors, `${paper.id}.authors`);
  for (const author of paper.authors) string(author, `${paper.id} author`, true);
  if (paper.image) await url(paper.image, `${paper.id}.image`);
  array(paper.links, `${paper.id}.links`);
  for (const item of paper.links) { string(item.label, "paper link label", true); await url(item.href, "paper link"); }
}
array(data.experience, "experience");
for (const item of data.experience) for (const key of ["period", "title", "institution"]) string(item[key], `experience.${key}`, true);
string(data.contact, "contact");
string(data.footer.updated, "footer.updated");

const html = await readFile(path.join(root, "index.html"), "utf8");
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) await url(match[1], "HTML asset");
console.log(`Checks passed: HTML assets, profile, ${data.publications.items.length} publications, and local file links.`);
if (data.profile.name === "Your Name") console.log("Reminder: replace the example profile and research content before publishing.");
