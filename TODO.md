# protvar-fe — TODO

- [ ] **Split semantic search into per-corpus API calls** (#29)
  Function paints before the heavier population. BE: add
  `corpus=function|population` param (back-compatible). FE: split
  `SemanticSearchPage` into two parallel per-corpus fetches with separate
  loading/page/hasMore + per-section "Load more". Scope: BE ~15 lines,
  FE ~60–100 lines.
