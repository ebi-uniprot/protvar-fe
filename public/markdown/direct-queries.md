#### <a id="direct-queries"></a>Direct Queries

Variant annotations can be accessed directly using the following URL structures and bypassing the input screen.

##### Query Types Supported
This following outlines the various direct query types supported by ProtVar and their corresponding URL structures.

##### 1. Free Text Search
* **URL Structure:** `/ProtVar/query?search=<search_term>`
* **Description:** Performs a general search based on the provided search term. The search term must be one of the ProtVar supported input formats. Search terms containing spaces and other special characters will be automatically encoded.
* **Examples:** (click to try)
    * [/ProtVar/query?search=NC_000021.9:g.25905076A>T](/ProtVar/query?search=NC_000021.9:g.25905076A>T) (HGVS Variant notation)
    * [/ProtVar/query?search=rs864622779](/ProtVar/query?search=rs864622779) (dbSNP ID)
    * [/ProtVar/query?search=P22304 A205P](/ProtVar/query?search=P22304%20A205P) (Protein-based search)

##### 2. Chromosome-Based Query
* **URL Structure:** `/ProtVar/<chromosome>/<position>/<reference_allele>/<alternative_allele>`
* **Description:** Queries based on a specific chromosome, position, reference allele, and alternative allele. Note in this structure, the chromosome needs to be prefixed by `chr` (e.g. chr1-22, chrX, chrY, and chrMT)
* **Example:** [/ProtVar/chr19/1010539/G/C](/ProtVar/chr19/1010539/G/C)

##### 3. Protein-Based Query
* **URL Structure:** `/ProtVar/<accession>/<protein_position>/<reference_AA>/<variant_AA>`
* **Description:** Queries based on a protein accession, position, reference amino acid, and variant amino acid.
* **Example:** [/ProtVar/Q4ZIN3/558/S/R](/ProtVar/Q4ZIN3/558/S/R)

##### 4. Chromosome-Based Query with Search Parameters
* **URL Structure:** `/ProtVar/query?chromosome=<chr>&genomic_position=<pos>&reference_allele=<ref>&alternative_allele=<alt>`
* **Description:** Performs a chromosome-based query using search parameters.
* **Example:** [/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C](/ProtVar/query?chromosome=19&genomic_position=1010539&reference_allele=G&alternative_allele=C)

##### 5. Protein-Based Query with Search Parameters
* **URL Structure:** `/ProtVar/query?accession=<acc>&protein_position=<pos>&reference_AA=<ref>&variant_AA=<var>`
* **Description:** Performs a protein-based query using search parameters.
* **Example:** [/ProtVar/query?accession=Q4ZIN3&protein_position=558&reference_AA=S&variant_AA=R](/ProtVar/query?accession=Q4ZIN3&protein_position=558&reference_AA=S&variant_AA=R)

**Note:**

- The `reference_allele` and `alternative_allele` parameters are optional for chromosome-based queries.
- The `reference_AA` and `variant_AA` parameters are optional for protein-based queries.
- For more information on ProtVar supported input formats, please refer to the Supported Input Formats help section.