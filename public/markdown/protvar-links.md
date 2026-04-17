# ProtVar Links

Direct links to ProtVar allow you to share specific queries, results, annotation panels, and structure views without going through the input screen.

---

## 1. Single Variant Query

A single-variant query accepts any ProtVar-supported input format and returns a single-page result.

### 1a. Free text (recommended)

```
/ProtVar/search?q=<variant>
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `q` | yes | Any ProtVar-supported input (see Supported Input Formats) |
| `assembly` | no | `grch37` or `grch38`; omit to auto-detect |

**Examples:**

- [`/ProtVar/search?q=NC_000021.9:g.25905076A>T`](/ProtVar/search?q=NC_000021.9:g.25905076A>T)
- [`/ProtVar/search?q=rs864622779`](/ProtVar/search?q=rs864622779)
- [`/ProtVar/search?q=P22304%20A205P`](/ProtVar/search?q=P22304%20A205P)
- [`/ProtVar/search?q=NM_000202.8:c.1327C>T&assembly=grch37`](/ProtVar/search?q=NM_000202.8:c.1327C>T&assembly=grch37)

---

### 1b. Direct genomic URL (path-based)

```
/ProtVar/g/<chromosome>/<position>[/<reference_allele>/<alternative_allele>]
```

| Segment | Required | Description |
|---------|----------|-------------|
| `chromosome` | yes | `1`–`22`, `X`, `Y`, `MT` (no `chr` prefix needed) |
| `position` | yes | Genomic coordinate |
| `reference_allele` | no | Reference base(s) |
| `alternative_allele` | no | Alternate base(s) |

**Examples:**

- [`/ProtVar/g/19/1010539/G/C`](/ProtVar/g/19/1010539/G/C)
- [`/ProtVar/g/19/1010539`](/ProtVar/g/19/1010539)
- [`/ProtVar/g/X/149498202/C/G?assembly=grch37`](/ProtVar/g/X/149498202/C/G?assembly=grch37)

---

### 1c. Direct protein variant URL (path-based)

```
/ProtVar/p/<accession>/<position>[/<reference_AA>/<variant_AA>]
```

| Segment | Required | Description |
|---------|----------|-------------|
| `accession` | yes | UniProt accession (e.g. `Q4ZIN3`) |
| `position` | yes | Amino acid position |
| `reference_AA` | no | Reference amino acid (one- or three-letter) |
| `variant_AA` | no | Variant amino acid (one- or three-letter) |

**Examples:**

- [`/ProtVar/p/Q4ZIN3/558/S/R`](/ProtVar/p/Q4ZIN3/558/S/R)
- [`/ProtVar/p/P22304/205/A/P`](/ProtVar/p/P22304/205/A/P)
- [`/ProtVar/p/Q4ZIN3/558`](/ProtVar/p/Q4ZIN3/558)

---

### 1d. Genomic query with named parameters

```
/ProtVar/search?chromosome=<chr>&position=<pos>[&ref=<ref>&alt=<alt>]
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `chromosome` | yes | `1`–`22`, `X`, `Y`, `MT` |
| `position` | yes | Genomic coordinate |
| `ref` | no | Reference allele |
| `alt` | no | Alternate allele |
| `assembly` | no | `grch37` or `grch38` |

**Example:**

[`/ProtVar/search?chromosome=19&position=1010539&ref=G&alt=C`](/ProtVar/search?chromosome=19&position=1010539&ref=G&alt=C)

---

### 1e. Protein query with named parameters

```
/ProtVar/search?accession=<acc>&position=<pos>[&ref=<ref_AA>&alt=<alt_AA>]
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `accession` | yes | UniProt accession |
| `position` | yes | Amino acid position |
| `ref` | no | Reference amino acid |
| `alt` | no | Variant amino acid |

**Example:**

[`/ProtVar/search?accession=Q4ZIN3&position=558&ref=S&alt=R`](/ProtVar/search?accession=Q4ZIN3&position=558&ref=S&alt=R)

---

## 2. Multi-Variant / Uploaded Results

When multiple variants are submitted or a file is uploaded, a unique result ID is generated. Results can be revisited and shared using this ID.

```
/ProtVar/result/<id>[?page=<n>&pageSize=<n>&assembly=<assembly>]
```

| Parameter | Required | Description |
|-----------|----------|-------------|
| `id` | yes | Unique result identifier (UUID) |
| `page` | no | Page number (default: `1`) |
| `pageSize` | no | Results per page: `10`, `25`, `50`, `100` (default: `25`) |
| `assembly` | no | `grch37` or `grch38` |

**Example:**

```
/ProtVar/result/a1b2c3d4-e5f6-...?page=2&pageSize=50
```

All filter, annotation, and structure parameters described below can also be appended to this URL.

---

## 3. Whole-Protein View

View all variants mapped to a UniProt protein. This is a browse view, not a single-variant query.

```
/ProtVar/<accession>
```

**Example:**

[`/ProtVar/P22304`](/ProtVar/P22304)

Filter, annotation, and structure parameters can be appended (see Sections 4–7).

> **Note:** Support for browsing by other identifier types (gene symbol, Ensembl, RefSeq, PDB ID) is planned for a future release.

---

## 4. Annotation Tab Linking

Open a specific annotation panel (Functional, Population, or Structural) directly from a URL by appending `annotation=` to any variant or result URL.

### Format

```
?annotation=<type>[-<row>]
```

| Value | Tab | Notes |
|-------|-----|-------|
| `fun` | Functional | |
| `pop` | Population | |
| `str` | Structural | |

The optional `-<row>` suffix specifies which result row to open (1-indexed). Omitting the suffix is equivalent to `-1` — both open row 1.

**Examples:**

```
# Open functional tab on row 1 — these are equivalent:
?annotation=fun
?annotation=fun-1

# Open structural tab on row 3
?annotation=str-3

# Open population tab on row 2
?annotation=pop-2
```

**Combined with a variant URL:**

- [`/ProtVar/p/P22304/205/A/P?annotation=fun`](/ProtVar/p/P22304/205/A/P?annotation=fun)
- [`/ProtVar/g/19/1010539/G/C?annotation=str`](/ProtVar/g/19/1010539/G/C?annotation=str)
- `/ProtVar/result/<id>?page=2&annotation=pop-3`

---

## 5. Structure Viewer Linking

When the structural annotation tab is open (`annotation=str`), additional parameters control which structure is displayed and what is highlighted.

### Structure selection

```
&structure=<type>[:<id>]
```

| Value | Description |
|-------|-------------|
| `pdb:<id>` | Specific PDB entry (e.g. `pdb:1ABC`) |
| `pdb` | First available PDB entry |
| `alphafold` | AlphaFold predicted structure |
| `alphafill` | AlphaFill ligand-aware prediction |
| `interaction:<id>` | Protein–protein interaction (e.g. `interaction:P12345_P67890`) |
| `interaction` | First available interaction |

### Highlighting and view options

| Parameter | Works with | Values | Description |
|-----------|------------|--------|-------------|
| `highlightChain` | PDB | chain letter, e.g. `A` | Highlight a specific chain |
| `highlightPocket` | AlphaFold / AlphaFill | pocket ID, e.g. `p1` | Highlight a predicted pocket |
| `highlightInterface` | Interaction | `true` | Highlight the interaction interface |
| `zoom` | All | `true` | Zoom to variant position |

Structure parameters are only active when `annotation=str` is also present. They are automatically removed from the URL when switching to another tab.

**Examples:**

```
# PDB with chain and zoom
?annotation=str&structure=pdb:1ABC&highlightChain=A&zoom=true

# AlphaFold with pocket
?annotation=str&structure=alphafold&highlightPocket=p1

# Interaction with interface
?annotation=str&structure=interaction:P12345_P67890&highlightInterface=true

# Row 2, different structure
?annotation=str-2&structure=pdb:2DEF&highlightChain=B
```

**Complete URL:**

[`/ProtVar/p/P22304/205/A/P?annotation=str&structure=pdb:1ABC&highlightChain=A&zoom=true`](/ProtVar/p/P22304/205/A/P?annotation=str&structure=pdb:1ABC&highlightChain=A&zoom=true)

---

## 6. Prediction Highlighting

When a Functional annotation tab is open, a specific prediction card can be scrolled to and highlighted by appending `pred=`.

```
?annotation=fun&pred=<prediction>
```

| Value | Prediction |
|-------|-----------|
| `cadd` | CADD score |
| `alphamissense` | AlphaMissense |
| `popeve` | popEVE |
| `esm` | ESM-1b |
| `conserv` | Residue conservation |
| `foldx` | FoldX stability |
| `m3d` | Missense3D |

The `pred` parameter is consumed on load and removed from the URL automatically.

**Example:**

[`/ProtVar/p/P22304/205/A/P?annotation=fun&pred=cadd`](/ProtVar/p/P22304/205/A/P?annotation=fun&pred=cadd)

---

## 7. Search Filters

Filters can be appended to any browse/result URL to narrow the displayed variants.

### Variant type

| Parameter | Values | Description |
|-----------|--------|-------------|
| `variant` | `known` `potential` | `known` = confirmed variants (default); `potential` = predicted |

### Functional filters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `ptm` | `true` | Has post-translational modification site at position |
| `mutagen` | `true` | Has mutagenesis data at position |
| `domain` | `true` | Falls within a UniProt domain |
| `consMin` | `0.0`–`1.0` | Residue conservation lower bound |
| `consMax` | `0.0`–`1.0` | Residue conservation upper bound |

### Population filters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `disease` | `true` | Has disease association |
| `freq` | `very_rare` `rare` `low` `common` | gnomAD allele frequency (repeatable) |

### Structural filters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `expModel` | `true` | Has experimental PDB structure |
| `interact` | `true` | Variant at protein–protein interaction site |
| `pocket` | `true` | Variant in predicted binding pocket |
| `stability` | `destabilizing` `stable` | FoldX stability prediction (repeatable) |

### Consequence / score filters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `cadd` | `low` `medium` `high` | CADD phred score bracket (repeatable): `low` < 15, `medium` 15–25, `high` > 25 |
| `am` | `benign` `ambiguous` `pathogenic` | AlphaMissense class (repeatable) |
| `popeve` | `severe` `moderate` `unlikely` | popEVE effect class (repeatable) |
| `esmMin` | float | ESM-1b LLR lower bound |
| `esmMax` | float | ESM-1b LLR upper bound |

### Sorting

| Parameter | Values | Description |
|-----------|--------|-------------|
| `sort` | `cadd` `am` `popeve` `esm1b` | Sort results by this score |
| `order` | `asc` `desc` | Sort direction (default: `asc`) |

**Filter example:**

[`/ProtVar/P22304?cadd=high&am=pathogenic&disease=true&freq=rare&freq=very_rare&sort=cadd&order=desc`](/ProtVar/P22304?cadd=high&am=pathogenic&disease=true&freq=rare&freq=very_rare&sort=cadd&order=desc)

---

## Backward Compatibility

The following URL patterns from previous versions of ProtVar remain supported. Please update any external links to use the new formats above.

**Redirected** — the browser URL is updated to the canonical form and a notification is shown. The old URL is replaced in browser history so the back button skips it.

**Accepted** — the old form is parsed silently; the URL is not changed.

| Old URL | New equivalent | Behaviour |
|---------|---------------|-----------|
| [`/ProtVar/query?search=P22304%20A205P`](/ProtVar/query?search=P22304%20A205P) | [`/ProtVar/search?q=P22304%20A205P`](/ProtVar/search?q=P22304%20A205P) | Redirected — `/query` → `/search`; `search=` → `q=` |
| [`/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C`](/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C) | [`/ProtVar/search?chromosome=19&position=1010539&ref=G&alt=C`](/ProtVar/search?chromosome=19&position=1010539&ref=G&alt=C) | Redirected — long param names → short names |
| [`/ProtVar/query?accession=P22304&protein_position=205&reference_AA=A&variant_AA=P`](/ProtVar/query?accession=P22304&protein_position=205&reference_AA=A&variant_AA=P) | [`/ProtVar/search?accession=P22304&position=205&ref=A&alt=P`](/ProtVar/search?accession=P22304&position=205&ref=A&alt=P) | Redirected — long param names → short names |
| [`/ProtVar/chr19/1010539/G/C`](/ProtVar/chr19/1010539/G/C) | [`/ProtVar/g/19/1010539/G/C`](/ProtVar/g/19/1010539/G/C) | Redirected — `chr`-prefixed path → `/g/` path |
| [`/ProtVar/P22304/205/A/P`](/ProtVar/P22304/205/A/P) | [`/ProtVar/p/P22304/205/A/P`](/ProtVar/p/P22304/205/A/P) | Redirected — bare protein path → `/p/` path |
| [`/ProtVar/P22304`](/ProtVar/P22304) | [`/ProtVar/P22304`](/ProtVar/P22304) | Unchanged — whole-protein view remains at this URL |
| `?annotation=functional-row-1` | `?annotation=fun` | Accepted — long form parsed; URL not changed |
| `?annotation=structural-row-2` | `?annotation=str-2` | Accepted — long form parsed; URL not changed |
| `?annotation=population-row-3` | `?annotation=pop-3` | Accepted — long form parsed; URL not changed |

---

## Quick Reference

```
# Single variant — free text
/ProtVar/search?q=<variant>[&assembly=grch37]

# Single variant — direct genomic
/ProtVar/g/<chr>/<pos>[/<ref>/<alt>][?assembly=grch37]

# Single variant — direct protein
/ProtVar/p/<accession>/<pos>[/<ref_AA>/<alt_AA>]

# Multi-variant result
/ProtVar/result/<id>[?page=N&pageSize=N]

# Whole-protein view
/ProtVar/<accession>

# Open annotation tab (row 1)
?annotation=fun | ?annotation=str | ?annotation=pop

# Open annotation tab (specific row)
?annotation=str-3

# Structure viewer
?annotation=str&structure=pdb:1ABC&highlightChain=A&zoom=true

# Prediction highlight
?annotation=fun&pred=cadd

# Filters
?cadd=high&am=pathogenic&disease=true&sort=cadd&order=desc
```
