// Stored markdown refers to a file by id and never by URL: a read URL is signed and expires within
// the hour, and the API is reachable under two different hosts (win/lnx), so either would rot in
// place. The id is turned into a URL only for display, and turned back before anything is saved.
const referencePrefix = "engraved:file/";

// Matches the markdown source rather than rendered HTML on purpose: this runs before marked, and on
// the way in and out of the editor, where there is no HTML yet.
const imagePattern = /(!\[[^\]]*\]\()([^)\s]+)(\s+"[^"]*")?(\))/g;

export function isFileReference(source: string) {
  return source.startsWith(referencePrefix);
}

function toFileReference(fileId: string) {
  return referencePrefix + fileId;
}

function getFileIdFromReference(source: string) {
  return source.slice(referencePrefix.length);
}

export function getReferencedFileIds(markdown: string): string[] {
  const ids = new Set<string>();

  for (const [, , source] of markdown.matchAll(imagePattern)) {
    if (isFileReference(source)) {
      ids.add(getFileIdFromReference(source));
    }
  }

  return [...ids];
}

// Ids without a URL yet are left as they are - the renderer knows to show nothing for them until one
// arrives, rather than an image that cannot load.
export function resolveFileUrls(
  markdown: string,
  urlsById: Record<string, string>,
) {
  return replaceImageSources(markdown, (source) =>
    isFileReference(source)
      ? (urlsById[getFileIdFromReference(source)] ?? source)
      : source,
  );
}

// The inverse, and the reason it exists: the editor hands back whatever it holds on every keystroke,
// so without this a resolved URL would be saved into the scrap text. It would render for an hour and
// then break, on content already stored - which is why this is a pure function with tests rather
// than a step someone has to remember.
export function toStoredMarkdown(markdown: string, knownFileIds: string[]) {
  const known = new Set(knownFileIds);

  return replaceImageSources(markdown, (source) => {
    const fileId = getFileIdFromUrl(source);

    return fileId && (known.has(fileId) || isSignedUrl(source))
      ? toFileReference(fileId)
      : source;
  });
}

function replaceImageSources(
  markdown: string,
  getSource: (source: string) => string,
) {
  return markdown.replace(
    imagePattern,
    (_, before: string, source: string, title = "", after: string) =>
      before + getSource(source) + title + after,
  );
}

// The blob name is the bare file id, which is exactly why blob paths were kept flat - see the design
// notes on issue #2987.
function getFileIdFromUrl(source: string) {
  if (!source.startsWith("http")) {
    return null;
  }

  try {
    const segments = new URL(source).pathname.split("/");

    return decodeURIComponent(segments[segments.length - 1]) || null;
  } catch {
    return null;
  }
}

// A belt-and-braces check beside the known-ids one: a signed URL must never end up in stored text,
// even for a file the entry no longer lists.
function isSignedUrl(source: string) {
  try {
    return new URL(source).searchParams.has("sig");
  } catch {
    return false;
  }
}
