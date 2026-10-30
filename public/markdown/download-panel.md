# <a id="download-panel"></a>Download Panel

The **Download Panel** opens as a side drawer from the **Download** button in the result-page toolbar. It queues an asynchronous job to generate a CSV (served zipped) of the current result: the same variants as on the page, with its filters and sort. The top of the panel shows what will be downloaded — the subject, the filters and the sort.

![Download Panel](images/download_panel.png)

## What you choose

**Output**

- **With annotations** — include annotation columns (default).
- **Mappings only** — variant-to-protein mapping columns only. Generates much faster.

Selecting *Mappings only* disables the **Annotations** checkboxes below.

**Annotations**

Tick the categories you want included:

- **Functional** — UniProt residue/region/protein annotations and pathogenicity/stability predictions.
- **Population** — co-located variants, allele frequencies, and disease associations.
- **Structure** — experimental structures and predicted models, with pockets and interfaces where available.

Each category adds time to generation. See the [Download File Format](#download-format) page for the exact columns per category.

**Pages**

- **All** — every page of the current result; the count shows how many. Not available above 100,000 variants, or when the count is capped or could not be completed in time — refine the filters, or for bulk data use the FTP site (linked at the top of the Activity Downloads tab).
- **Current** — only the page in view, honouring the current `page` and `pageSize` parameters.

A single-variant lookup has no page choice.

## Email and Job Name

- **Email** *(optional)* — get notified once when the file is ready.
- **Job Name** *(optional)* — a label for your Downloads list. If left blank, ProtVar suggests one based on the source (e.g. `BRCA1`, `P22304, 6ioz`, the variant string or upload name, followed by up to two active filters, e.g. `P22304 · PTM`; a filter-only download is named after its filters, e.g. `Predicted Pocket (page 3)`).

## Submit

Press **Generate** to queue the job, or **Cancel** to close. The job then appears in [Activity → Downloads](#activity:activity-downloads), where you can watch its status and download the file. Files are kept for 30 days; after that the entry shows as *Expired*.
