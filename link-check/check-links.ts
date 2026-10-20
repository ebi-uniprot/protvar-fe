// Daily check of every external link in src/constants/ExternalUrls.ts (plain HTTP, no browser).
// Run by the scheduled GitLab pipeline (link_check job); exits 1 if any link fails, which
// fails the pipeline and sends the failure email.
//
// Local run:  node --experimental-strip-types link-check/check-links.ts

import * as urls from '../src/constants/ExternalUrls.ts';

type Check = {
  url: string;
  host?: string;      // expected final host when the link legitimately redirects off-site
  botWall?: boolean;  // site rejects automated requests (403/429/500); only a 404 or dead site fails
};

// Sample IDs from ProtVar's own example (IDS, P22304, X 149498202 C/G) where possible.
// A string value means the constant is deliberately not checked, and why.
const CHECKS: Record<string, Check | Check[] | string> = {
  // --- Result table ---
  ENSEMBL_ID_URL: 'covered by getEnsemblIdUrl',
  ENSEMBL_BROWSER_URL: 'covered by getEnsemblViewUrl',
  getEnsemblIdUrl: [
    { url: urls.getEnsemblIdUrl('ENSG00000010404.18') },
    { url: urls.getEnsemblIdUrl('ENSP00000339801') },
    { url: urls.getEnsemblIdUrl('ENST00000340855') },
  ],
  getEnsemblViewUrl: { url: urls.getEnsemblViewUrl('X', 149498202) },
  UNIPROT_ACCESSION_URL: { url: urls.UNIPROT_ACCESSION_URL + 'P22304' },
  DBSNP_URL: { url: urls.DBSNP_URL + 'rs864622779' },
  CLINVAR_RCV_URL: { url: urls.CLINVAR_RCV_URL + 'RCV000011331' },
  CLINVAR_VCV_URL: { url: urls.CLINVAR_VCV_URL + 'VCV000010698' },
  COSMIC_URL: { url: urls.COSMIC_URL + 'COSV57102498' },
  CADD_INFO_URL: { url: urls.CADD_INFO_URL },
  AM_INFO_URL: { url: urls.AM_INFO_URL },

  // --- Annotations ---
  RHEA_URL: { url: urls.RHEA_URL + '10000', botWall: true },
  INTACT_URL: { url: urls.INTACT_URL + 'P22304' },
  PUBMED_URL: { url: urls.PUBMED_URL + '11093265' },
  MISSENSE3D_URL: { url: `${urls.MISSENSE3D_URL}?uniprot_id=P22304&var_id=A205P` },
  GNOMAD_VARIANT_URL: { url: `${urls.GNOMAD_VARIANT_URL}1-55051215-G-GA?dataset=gnomad_r4` },
  PDB_URL_INTERFACE_BY_PROTEIN: { url: urls.PDB_URL_INTERFACE_BY_PROTEIN + 'P22304' },
  ALPHAFOLD_URL_INTERFACE_BY_PROTEIN: { url: urls.ALPHAFOLD_URL_INTERFACE_BY_PROTEIN + 'P22304' },

  // --- APIs ---
  ALPHAFOLD_URL: { url: urls.ALPHAFOLD_URL + 'P22304' },
  ALPHAFILL_URL: { url: urls.ALPHAFILL_URL + 'P22304' },
  PUBMED_EUTILS_URL: { url: `${urls.PUBMED_EUTILS_URL}/esummary.fcgi?db=pubmed&id=11093265&retmode=json` },

  // --- Help, footer, About and Contact pages ---
  ENSEMBL_HOME_URL: { url: urls.ENSEMBL_HOME_URL },
  ENSEMBL_VEP_URL: { url: urls.ENSEMBL_VEP_URL },
  UNIPROT_HOME_URL: { url: urls.UNIPROT_HOME_URL },
  OPEN_TARGETS_URL: { url: urls.OPEN_TARGETS_URL },
  DECIPHER_URL: { url: urls.DECIPHER_URL, botWall: true },
  PDBE_URL: { url: urls.PDBE_URL },
  ALPHAFOLD_HOME_URL: { url: urls.ALPHAFOLD_HOME_URL },
  CADD_HOME_URL: { url: urls.CADD_HOME_URL },
  EVE_URL: { url: urls.EVE_URL },
  FOLDX_URL: { url: urls.FOLDX_URL },
  COSMIC_HOME_URL: { url: urls.COSMIC_HOME_URL },
  MOLSTAR_URL: { url: urls.MOLSTAR_URL },
  NCBI_URL: { url: urls.NCBI_URL },
  CROSSMAP_URL: { url: urls.CROSSMAP_URL, botWall: true },
  VARSITE_URL: { url: urls.VARSITE_URL },
  MCP_SPEC_URL: { url: urls.MCP_SPEC_URL },
  PROTVAR_PAPER_URL: { url: urls.PROTVAR_PAPER_URL, host: 'academic.oup.com', botWall: true },
  PROTVAR_VIDEO_URL: { url: urls.PROTVAR_VIDEO_URL },
  PROTVAR_TWITTER_URL: 'x.com blocks automated requests',
  CONTACT_FORM_URL: { url: urls.CONTACT_FORM_URL },
  CC_BY_URL: { url: urls.CC_BY_URL },
  EBI_URL: { url: urls.EBI_URL },
  EMBL_URL: { url: urls.EMBL_URL },
  EMBL_DE_URL: { url: urls.EMBL_DE_URL, host: 'www.embl.org' },
  EBI_TEAM_URL: { url: urls.EBI_TEAM_URL },
  EBI_PERSON_URL: [{ url: urls.EBI_PERSON_URL + 'james-stephenson' }, { url: urls.EBI_PERSON_URL + 'prabhat-totoo' }],
  EBI_TERMS_URL: { url: urls.EBI_TERMS_URL },
  EBI_PRIVACY_URL: { url: urls.EBI_PRIVACY_URL },
};

const bareHost = (u: string) => new URL(u).host.replace(/^www\./, '');

// Deliberately not a browser user agent: Ensembl serves 200 for any path to browsers and only
// redirects client-side, but redirects other clients server-side, where we can see it.
const UA = 'ProtVar-link-check/1.0 (+https://www.ebi.ac.uk/ProtVar)';

// Follows redirects by hand so a hop to another host (e.g. ensembl.org -> archive) is caught.
async function check(c: Check): Promise<string | null> {
  let url = c.url;
  for (let hop = 0; hop < 10; hop++) {
    const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30_000) });
    await res.body?.cancel();
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      url = new URL(location, url).href;
      continue;
    }
    if (c.botWall && res.status !== 404 && res.status !== 410) return null;
    if (res.status >= 400) return `HTTP ${res.status}` + (url !== c.url ? ` at ${url}` : '');
    if (bareHost(url) !== bareHost(c.host ? `https://${c.host}` : c.url)) return `redirected off-site to ${url}`;
    return null;
  }
  return 'too many redirects';
}

async function withRetry(c: Check): Promise<string | null> {
  let err: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try { err = await check(c); } catch (e) { err = (e as Error).message; }
    if (!err) return null;
    await new Promise(r => setTimeout(r, 10_000));
  }
  return err;
}

// Every export in ExternalUrls.ts must have a check (or a reason to skip), and vice versa.
const missing = Object.keys(urls).filter(k => !(k in CHECKS));
const unknown = Object.keys(CHECKS).filter(k => !(k in urls));
if (missing.length || unknown.length) {
  if (missing.length) console.error(`No check for: ${missing.join(', ')} (add one to CHECKS in link-check/check-links.ts)`);
  if (unknown.length) console.error(`Check for unknown export: ${unknown.join(', ')}`);
  process.exit(1);
}

const failures: string[] = [];
for (const [name, entry] of Object.entries(CHECKS)) {
  if (typeof entry === 'string') { console.log(`SKIP  ${name}: ${entry}`); continue; }
  for (const c of Array.isArray(entry) ? entry : [entry]) {
    const err = await withRetry(c);
    console.log(`${err ? 'FAIL' : 'OK  '}  ${name}  ${c.url}${err ? `\n      -> ${err}` : ''}`);
    if (err) failures.push(`${name}  ${c.url}\n    ${err}`);
  }
}

if (failures.length) {
  console.log(`\n${failures.length} broken link(s):\n\n${failures.join('\n\n')}`);
  process.exit(1);
}
console.log('\nAll links OK');
