# <a id="semantic-search"></a>Semantic Search

Semantic Search lets you find proteins using natural language — disease names, phenotypes, pathways, or any biological description — instead of exact identifiers.

## How it works

Unlike a keyword search, which looks for exact word matches, semantic search understands the *meaning* of your query. It uses machine learning embeddings to compare your input against millions of protein annotation texts from UniProt (function descriptions, disease associations, pathway memberships, and more). Proteins whose annotations are conceptually similar to your query are ranked by relevance.

This means:
- **"Parkinson's disease"** will surface proteins associated with neurodegeneration, alpha-synuclein aggregation, and dopaminergic pathways — not just proteins where the text "Parkinson's" appears.
- **"DNA repair"** returns proteins involved in repair mechanisms even if they are annotated with related terms like "nucleotide excision" or "mismatch correction".
- Synonyms and related concepts are recognised automatically.

## What each result shows

Each result card shows:
- **Protein name & accession** — the recommended name and UniProt accession of the matched protein
- **Relevance score** — how closely the protein's annotations match your query (higher is better; ≥80% is a strong match)
- **Annotation badges** — the types of annotation that contributed to the match (e.g. Disease, Function, Pathway)
- **Best-matching text** — the specific annotation snippet most similar to your query

Click **View variants** on any card to go straight to the variant annotation page for that protein.

## Tips for best results

- Use descriptive phrases rather than single keywords: *"calcium channel involved in cardiac arrhythmia"* works better than *"calcium"*.
- Disease names, phenotype terms (HPO-style), pathway names, and functional roles all work well.
- If results are too broad, add more context: *"breast cancer tumour suppressor"* is more precise than *"cancer"*.
- The search covers function, pathway, disease, tissue specificity, and other annotation fields from UniProt Swiss-Prot human proteins.

## Embedding models

The model selector in the toolbar controls which embedding model is used to encode your query. Different models have different strengths:

| Model | Best for |
|-------|----------|
| **MPNet** *(default)* | General-purpose query-to-document retrieval |
| **MiniLM** | Fast, lightweight queries — useful for quick exploration |
| **BioBERT** | Biomedical NLI tasks, disease and function descriptions |

If you are unsure which model to use, leave the default (MPNet) selected.
