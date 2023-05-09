import React, {useState} from 'react'
import Button from '../../elements/form/Button'
import {Assembly, DEFAULT_ASSEMBLY, StringVoidFun} from '../../../constants/CommonTypes';
import Spaces from '../../elements/Spaces';

interface PasteVariantSearchProps {
  isLoading: boolean
  assembly: Assembly
  updateAssembly: (assembly: Assembly) => void
  fetchPasteResult: StringVoidFun
}

function PasteVariantSearch(props: PasteVariantSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const populateVCF = () => {
    setSearchTerm('X\t149498202\t.\tC\tG\n' +
        '10\t43118436\t.\tA\tC\n' +
        '2\t233760498\t.\tG\tA\n' +
        '14\t89993420\t.\tA\tG')
  };

  const populateGnomAD = () => {
    setSearchTerm('X-149498202-C-G\n' +
        '10-43118436-A-C\n' +
        '2-233760498-G-A\n' +
        '14-89993420-A-G')
  };

  const populateHGVS = () => {
    setSearchTerm('NC_000023.11:g.149498202C>G\n' +
        'NC_000010.11:g.43118436A>C\n' +
        'NC_000002.12:g.233760498G>A')
  };

  const populateProtAC = () => {
    setSearchTerm('P22304 A205P\n' +
        'P07949 asn783thr\n' +
        'P22309 71 Gly Arg')
    props.updateAssembly(DEFAULT_ASSEMBLY)
  };

  const populateRs = () => {
    setSearchTerm('rs864622779\n' +
        'rs587778656\n' +
        'rs4148323')
    props.updateAssembly(DEFAULT_ASSEMBLY)
  };

  const protACTitle = "Supported format examples:\n" +
      " ACC X 999 Y\n" +
      " ACC/X/999/Y\n" +
      " ACC X/999/Y\n" +
      " ACC 999 X Y\n" +
      " ACC 999    X     Y\n" +
      " ACC p.XXX999YYY\n" +
      " ACC X999Y\n" +
      " ACC 999 X/Y\n" +
      " ACC 999 XXX/YYY\n" +
      " ACC XXX999YYY\n" +
      " ACC/999/YYY\n" +
      " where\n" +
      " ACC=protein accession,\n" +
      " X=one letter ref AA, XXX=three letters ref AA (case-insensitive),\n" +
      " Y=one letter variant AA, YYY=three letters variant AA (case-insensitive),\n" +
      " 999=protein position."

  const rsTitle = "Search by Variant (rs) IDs."

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchTerm === '') {
      return;
    }
    props.fetchPasteResult(searchTerm)
  };

  const pasteBox: string = "Paste variants here. Accepted formats are VCF, HGVS, dbSNP, protein position.\n" +
      "Mixed formats are allowed, however mixed genome assemblies are not.\n" +
      "Test inputs can be found to the right\n" +
      "\n" +
      "X\t149498202\t.\tC\tG\n" +
      "X-149498202-C-G\n" +
      "NC_000023.11:g.149498202C>G\n" +
      "P22304 A205P\n" +
      "rs864622779\n"

  return <div id="search" className="card-table search">
    <div className="card">
      <section className="card__actions">
        <span className="card-header">
          <p>
            <b>Search Variants</b>
          </p>
        </span>
      </section>
      <section className="card--has-hover top-row" role="button">
        <div className="card__content">
          <section className="uniprot-card">
            <section className="uniprot-card__left">

              <div className="assembly">
                  <span title="Genome assembly conversion from GRCh37 to GRCh38 works for genomic input types only i.e. for input in VCF, HGVS or gnomAD formats. Protein position and DBSNP ID inputs are assumed to be in GRCh38.">Reference Genome Assembly</span>
                  <div className="assembly-radio-check">
                    <label>
                      <input type="radio" name="grch" value="grch38" checked={props.assembly===Assembly.GRCh38} onChange={() => props.updateAssembly(Assembly.GRCh38)}/>
                      GRCh38</label>
                    <label>
                    <input type="radio" name="grch" value="grch37" checked={props.assembly===Assembly.GRCh37} onChange={() => props.updateAssembly(Assembly.GRCh37)}/>
                    GRCh37</label>
                    <label>
                      <input type="radio" name="grch" value="auto" checked={props.assembly===Assembly.AUTO} onChange={() => props.updateAssembly(Assembly.AUTO)}/>
                      Auto-detect</label>
                  </div>
              </div>
              <div className="flex padding-bottom-1x">
                <b>Examples:</b>
                <Spaces count={2} />
                <button onClick={populateVCF} className="ref-link" id="vcfExampleButton">VCF</button>
                <Spaces count={2} />
                <button onClick={populateGnomAD} className="ref-link" id="gnomadExampleButton">gnomAD</button>
                <Spaces count={2} />
                <button onClick={populateHGVS} className="ref-link" id="hgvsExampleButton">HGVS</button>
                <Spaces count={2} />
                <button onClick={populateProtAC} className="ref-link" id="protACExampleButton" title={protACTitle}>Protein Position</button>
                <Spaces count={2} />
                <button onClick={populateRs} className="ref-link" id="rsExampleButton" title={rsTitle}>Variant ID</button>
              </div>

              <textarea
                id="main-textarea-search-field"
                className="main-textarea-search-field"
                value={searchTerm}
                placeholder={pasteBox}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </section>

          </section>
        </div>
      </section>
      <div className="search-button-group">
        <Button
          type="submit"
          onClick={props.isLoading ? () => { } : handleSubmit}
          className="button-primary"
          id="searchButton"
        >
          {props.isLoading ? "Loading..." : "Search"}
        </Button>
      </div>
    </div>
  </div>
}

export default PasteVariantSearch;