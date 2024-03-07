export const PASTE_BOX =
  `Paste variants here. Genomic, cDNA, Protein and ID input types are accepted. Click on the examples to see supported formats. Mixed formats are allowed, however mixed genome assemblies are not.
Test inputs can be found to the right

X\t149498202\t.\tC\tG
X-149498202-C-G
NC_000023.11:g.149498202C>G
P22304 A205P
rs864622779
  `;

export const GENOMIC_EXAMPLE =
  `X\t149498202\t.\tC\tG
10-43118436-A-C
NC_000002.12:g.233760498G>A
14 89993420 A/G
  `;
export const CDNA_EXAMPLE =
  `NM_000202.8:c.1327C>T
NM_020975.6(RET):c.3105G>A (p.Glu1035Glu)
NM_000463.3(IDS):c.1124C>T
NM_018319.4:c.1478A>G p.(His493Arg)
  `;
export const PROTEIN_EXAMPLE =
  `P22304 A205P
P07949 asn783thr
NP_001305738.1:p.Pro267Ser
P22309 71 Gly Arg
  `;
export const ID_EXAMPLE=
  `RCV001270034
VCV002573141
COSV64777467
COSM1667583
COSN190667
rs864622779
rs587778656
  `;

export const GENOMIC_BTN_TITLE =
  `VCF
gnomAD
HGVS g.
Custom genomic formats including the following
X 149498202 C G (without variant ID/lenient VCF)
X 149498202 C/G
X 149498202 C>G
  `;

export const CDNA_BTN_TITLE =
  `HGVS c. (using RefSeq IDs)
  `;

export const PROTEIN_BTN_TITLE =
  `HGVS p. (using RefSeq IDs)
Custom protein inputs including the following
P22304 A205P
P07949 asn783thr
P22309 71 Gly Arg
P22304 205 A/P
  `;

export const ID_BTN_TITLE =
  `DBSNP
ClinVar
COSMIC
  `;