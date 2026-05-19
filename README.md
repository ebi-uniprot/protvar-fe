# ProtVar Front-end

The web UI for **ProtVar**, UniProt's variant annotation tool at EBI. It lets
users submit genomic/protein variants and explore their functional, structural,
population and predicted-effect annotations.

- React 18 + TypeScript, bootstrapped with Create React App (`react-scripts`)
- Talks to the [ProtVar back-end](https://github.com/ebi-uniprot/protvar-be) for
  all variant data
- Live service: <https://www.ebi.ac.uk/ProtVar>

## Dependencies

### ProtVar back-end (required)

Every variant query, upload, annotation lookup, download and semantic search
goes through the ProtVar BE REST API. Its base URL is set per environment by
`REACT_APP_API_BASE_URL`:

| File | Points at |
|---|---|
| `.env` | `https://wwwdev.ebi.ac.uk/ProtVar/api` (dev) |
| `.env.local` | `https://wwwint.ebi.ac.uk/ProtVar/api` (internal) — local override |

Uncomment the `localhost:8080` line in `.env.local` to run against a local BE.

### Third-party services called from the browser

Unlike the BE — which makes no external API calls — the FE calls a few
third-party services **directly from the user's browser**. All are intentional
and non-critical: none are required for core variant annotation, and each
degrades gracefully if unavailable.

**3D structure tab** — the viewer loads structures live from their source on
demand; ProtVar does not cache or proxy structure files.

| Service | Endpoint | Used for | Code |
|---|---|---|---|
| AlphaFold DB | `https://alphafold.ebi.ac.uk/api/prediction/` | Predicted-structure metadata + model | `AlphafoldService.ts` |
| AlphaFill | `https://alphafill.eu/v1/aff/` | AlphaFill structure availability + model | `AlphafillService.ts` |
| PDBe | PDBe coordinate servers (via the `pdbe-molstar` web component) | Experimental PDB structure files | `pdbe-molstar` |

**Other**

| Service | Endpoint | Used for | Code |
|---|---|---|---|
| NCBI E-utilities | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils` | PubMed article titles for PMIDs (recent addition) | `PubMedList.tsx` |
| Google Forms | `https://docs.google.com/forms/d/…/formResponse` | "Subscribe for updates" form submission | `Subscribe.tsx` |

### Not runtime dependencies

- **External hyperlinks** — `constants/ExternalUrls.ts` (Ensembl, UniProt,
  dbSNP/ClinVar/COSMIC, RHEA, IntAct, CADD, AlphaMissense …) and footer links
  are `<a href>` targets only; the app never calls them programmatically.
- **Static content** — markdown help pages (`public/markdown/`) and
  `citations.csv` are served from the app's own origin, not fetched externally.

## Running locally

Requires Node.js ≥ 22 and `yarn`.

```sh
git clone https://github.com/ebi-uniprot/protvar-fe.git
cd protvar-fe
yarn install
yarn start          # serves http://localhost:3000
```

By default `yarn start` reads `.env.local`, so the dev server talks to the
internal BE. Point it elsewhere by editing `REACT_APP_API_BASE_URL`.

## Build

```sh
yarn build          # production bundle in build/
```

`.env.production` disables source maps for the production build.

## Deployment

The GitHub repo is mirrored to GitLab EBI, where the CI/CD pipeline builds the
bundle and serves it via nginx (`deploy/Dockerfile`, `deploy/nginx.conf`).
Deployment is branch-driven:

| Branch | Environment |
|---|---|
| `int` | internal |
| `dev` | development (beta) |
| `main` | live / public |

Commit or merge to the relevant branch and the GitLab pipeline deploys it; the
mirror can take a couple of minutes to refresh from GitHub.
