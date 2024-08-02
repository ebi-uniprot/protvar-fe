import React from "react";
import {HelpBtn} from "./HelpBtn";

export const InputFormatHelp = () => {
  return <HelpBtn title="Input format help" content={<InputFormatHelpContent/>} />
}

const InputFormatHelpContent = () => {
  return <div className="help-section">
    <h5>Supported Input Types</h5>

    <h6>Variant ID</h6>
    <p>Variant ID input must be a single word with no spaces, beginning with a specific prefix.</p>
    <ul>
      <li><strong>Examples:</strong> rs12345, RCV0123, COSM9876</li>
      <li><strong>Prefixes:</strong> dbSNP (rs), ClinVar (RCV or VCV), COSMIC (COSV, COSM, or COSN)</li>
    </ul>

    <h6>Genomic</h6>
    <p>Genomic input should follow one of the specified formats.</p>
    <ul>
      <li><strong>gnomAD format:</strong> CHR-POS-REF-ALT (e.g., 1-12345-A-G)</li>
      <li><strong>VCF format:</strong> CHR POS ID REF ALT (...) (e.g., 1 12345 . A G)
        <br/>
        <small>The first 5 columns of the VCF input are mandatory. Any fields after this (specified as ...) are optional and ignored.</small>
      </li>
      <li><strong>Custom format:</strong> CHR POS (REF (ALT)) (e.g., X 23456 C T)
        <br/>
        <small>The alternate allele, or both the reference and alternate alleles, are optional.
          If both alleles are provided, any of a space, greater-than (&gt;) sign, or forward slash (/) between them are valid.</small>
      </li>
    </ul>
    <p>
      <strong>CHR:</strong> Chromosome (1-22, X, Y, M, MT, mit, mtDNA, mitochondria, mitochondrion)<br/>
      <strong>POS:</strong> Position on the chromosome (integer)<br/>
      <strong>REF:</strong> Reference base (A, T, C, G)<br/>
      <strong>ALT:</strong> Alternate base (A, T, C, G)
    </p>

    <h6>Protein</h6>
    <p>Protein input should follow one of the specified formats.</p>
    <ul>
      <li><strong>Custom format 1:</strong> ACC (p.)REF<b>POS</b>ALT (e.g., P22304 A205P)
        <br/>
        <small>The <i>p.</i> is optional.</small>
      </li>
      <li><strong>Custom format 2:</strong> ACC POS (REF (ALT)) (e.g., P22309 71 (Gly (Arg)))
        <br/>
        <small>The alternate, or both the reference and alternate amino acid, are optional.</small>
        </li>
      <li><strong>Custom format 3:</strong> ACC POS REF/ALT (e.g., P22304 205 A/P)</li>
    </ul>
    <p>
      <strong>ACC:</strong> Accession number<br/>
      <strong>POS:</strong> Amino acid position (integer)<br/>
      <strong>REF:</strong> Reference amino acid (1- or 3-letter code)<br/>
      <strong>ALT:</strong> Alternate amino acid (1- or 3-letter code, TER, *, =)
    </p>

    <h6>HGVS</h6>
    <ul>
      <li>The <strong>Reference Sequence</strong> part of the input should be a valid RefSeq identifier with the prefix
        NC, NM, or NP.
        Optionally, the gene code can be included within brackets.
      </li>
      <li>The <strong>Variant Description</strong> part of the input should be valid for the specific scheme.</li>
      <li><strong>Supported schemes:</strong>
        <ul>
          <li>HGVS genomic (g.) format (e.g., NC_000001.10:g.12345A&gt;G)</li>
          <li>HGVS protein (p.) format (e.g., NP_000001.1:p.Ala123Val).</li>
          <li>HGVS coding (c.) format (e.g., NM_000001.2:c.123A&gt;G).</li>
        </ul>
      </li>
      <li><strong>Unsupported schemes:</strong> HGVS non-coding, mitochondrial, and RNA schemes (n., m., r.).</li>
    </ul>
  </div>
}
