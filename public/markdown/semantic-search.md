# <a id="semantic-search"></a>Semantic Search <span class="experimental-text-badge"><i class="bi bi-flask"></i> experimental</span>

Semantic Search lets you find proteins using natural language — disease names, phenotypes, pathways, or any biological description — instead of exact identifiers.

> **⚠️ About AI-enabled search**
>
> This feature uses AI text-embedding models to find results by meaning rather than exact keyword matching. Because these models are trained on different datasets, some search terms return more accurate or complete results than others. A returned result is the model's best estimate of relevance — not a guarantee of correctness, and relevant entries may occasionally be missed or ranked low. Treat results as a guide for exploration and confirm anything important against ProtVar's curated annotations and primary sources.

![Semantic Search tab](images/semantic_search.png)

## How it works

Unlike a keyword search, which looks for exact word matches, semantic search understands the *meaning* of your query. It uses machine learning embeddings to compare your input against UniProt annotation texts. Two corpora are searched in parallel:

- **Protein function** — protein-level descriptions (function, pathway, disease, tissue specificity, …).
- **Variants** — per-variant texts (the variant notation, clinical significance, and disease association).

Matches from each corpus are ranked by relevance and shown in two separate sections — the relevance scores are calibrated *within* a corpus, so don't compare a function score directly against a variant score.

This means:
- **"Parkinson's disease"** will surface proteins associated with neurodegeneration, alpha-synuclein aggregation, and dopaminergic pathways — not just proteins where the text "Parkinson's" appears.
- **"DNA repair"** returns proteins involved in repair mechanisms even if they are annotated with related terms like "nucleotide excision" or "mismatch correction".
- Synonyms and related concepts are recognised automatically.

## What the results show

![Semantic search results for "warfarin sensitivity"](images/semantic_search_result.png)

Results appear in two sections.

**Protein function** — proteins whose annotations match your query. Each card shows:
- **Protein name & accession** — the recommended name and UniProt accession
- **Relevance score** — how closely the annotations match your query (higher is better; ≥80% is a strong match)
- **Annotation badges** — the annotation types that contributed (e.g. Disease, Function, Pathway)
- **Best-matching text** — the specific annotation snippet most similar to your query

Click **View variants** to go straight to the variant annotation page for that protein.

**Variants** — individual variants whose annotation matches your query. Each card groups the matching variants for a protein; each match shows the residue position (links straight to that variant) and the matching text — typically the variant's clinical significance and disease association.

## Tips for best results

- Use descriptive phrases rather than single keywords: *"calcium channel involved in cardiac arrhythmia"* works better than *"calcium"*.
- Disease names, phenotype terms (HPO-style), pathway names, and functional roles all work well.
- If results are too broad, add more context: *"breast cancer tumour suppressor"* is more precise than *"cancer"*.
- The search covers function, pathway, disease, tissue specificity, and other annotation fields from UniProt Swiss-Prot human proteins.

## Embedding models

The model selector in the toolbar chooses which embedding model encodes your query. Models behave differently — the **same query can return different proteins** depending on the model, so the choice matters:

| Model | Best for |
|-------|----------|
| **Qwen3** *(default)* | The best all-rounder for both protein function and variant searches — especially short or broad terms (*"cancer"*, *"DNA repair"*) |
| **EmbeddingGemma** | Longer descriptive queries (*"calcium channel involved in cardiac arrhythmia"*) — close to Qwen3 overall |
| **BGE** | Loosely-phrased or conceptual queries — strong at matching meaning over exact wording |
| **MiniLM** | Fast and lightweight — handy for quick exploration with short queries |
| **BioBERT** | Disease and function queries — a biomedical model |
| **BioLORD** | Phenotype and clinical-feature descriptions (HPO-style terms) |
| **MPNet** | General question-to-document retrieval — broader, but weaker on biomedical specifics |

If you are unsure, leave the default (Qwen3) selected; if a query returns little, try EmbeddingGemma or BGE.

### How we chose the default

We compared the models on 71 queries: real searches made on ProtVar, curated disease, phenotype and function queries, and the examples on this site. For each query, the top 10 protein function and variant results of every model were pooled and graded *relevant*, *partly relevant* or *not relevant* by an independent language model (not one of the models compared), then scored with nDCG@10 (1.0 = the best possible ranking). Qwen3 scored highest overall (0.72 function, 0.70 variants), followed by EmbeddingGemma (0.72, 0.66); BioBERT, the previous default, scored 0.57 and 0.51. The grading is automated rather than expert-curated, so treat the scores as a relative comparison between models.
