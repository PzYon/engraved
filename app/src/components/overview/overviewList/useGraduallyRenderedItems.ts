import { useEffect, useState } from "react";

// How many items are added to the screen in one go: enough to fill the screen
// with the first chunk, and still few enough to be rendered without the delay
// being felt, even with everything an item can show - text, files, a footer
// full of actions.
export const chunkSize = 12;

// Rendering an item is expensive, and a list of a hundred of them used to
// block everything until the last one was done. So a list starts with its
// first items and adds the others chunk by chunk, each in a task of its own,
// which lets the browser paint and handle input in between.
//
// Not as a transition: React Query and the router keep their state in external
// stores, and when one of those changes while a transition is being rendered -
// which is the normal case right after opening a page - React starts over and
// renders everything in one blocking go after all.
//
// mustIncludeIndex is for the item that has the focus: it is rendered right
// away wherever it is, as the focus cannot wait for its turn.
export function useGraduallyRenderedItems<T>(
  items: T[],
  mustIncludeIndex: number,
): T[] {
  const [renderedCount, setRenderedCount] = useState(chunkSize);

  // Fewer items than before, as with a filter: continue from there, so that
  // the items coming back later are brought in gradually as well.
  const countToKeep = Math.max(items.length, chunkSize);
  if (renderedCount > countToKeep) {
    setRenderedCount(countToKeep);
  }

  const count = Math.max(renderedCount, mustIncludeIndex + 1);
  const isComplete = count >= items.length;

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timer = window.setTimeout(() => setRenderedCount(count + chunkSize));

    return () => window.clearTimeout(timer);
  }, [isComplete, count]);

  return isComplete ? items : items.slice(0, count);
}
