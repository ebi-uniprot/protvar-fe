// Display order for the semantic-search embedding models — best-first.
// Single source of truth for the model dropdown (SemanticSearchPage) and the
// status card (StatusPage). Keep in sync with the model-guidance table in
// public/markdown/semantic-search.md.
export const MODEL_ORDER = ['biobert', 'bge', 'biolord', 'mpnet', 'minilm'];

// Rank a model id by MODEL_ORDER; unlisted ids sort last.
export const modelRank = (id: string): number => {
  const i = MODEL_ORDER.indexOf(id);
  return i === -1 ? MODEL_ORDER.length : i;
};
