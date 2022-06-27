import React, { useState } from 'react'
import Button from '../../elements/form/Button'
import { ENSEMBL_ASML_URL } from '../../../constants/ExternalUrls';
import { StringVoidFun } from '../../../constants/CommonTypes';
import Spaces from '../../elements/Spaces';

interface PasteVariantSearchProps {
  isLoading: boolean
  fetchPasteResult: StringVoidFun
}

function PasteVariantSearch(props: PasteVariantSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const populateVCF = () => {
    setSearchTerm('19 1010539 rs124582 G/C . . .\n14 89993420 rs37915333 A/G . . .\n10 87933147 rs7565837 C/T . . .')
  };

  const populateHGVS = () => {
    setSearchTerm('NC_000019.10:g.1010539G>C\nNC_000014.9:g.89993420A>G\nNC_000010.11:g.87933147C>T')
  };

  const populateProtAC = () => {
    setSearchTerm('Q4ZIN3 S558R\nQ9NUW8 H493R\nP60484 R130T\nP60484 N130G')
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

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchTerm === '') {
      return;
    }
    props.fetchPasteResult(searchTerm)
  };


  return <div id="search" className="card-table search">
    <div className="card">
      <section className="card__actions">
        <span className="card-header">
          <p>
            <b>Paste Variants (GRCh38)</b>
          </p>
        </span>
      </section>
      <section className="card--has-hover top-row" role="button">
        <div className="card__content">
          <section className="uniprot-card">
            <section className="uniprot-card__left">

              <span className="genome-assembly-text">
                <p>
                  Reference Genome Assembly GRCh38 (hg38): {' '}
                  <a href={ENSEMBL_ASML_URL} target="_blank" rel="noopener noreferrer" className="ref-link">
                    Ensembl's Assembly Remapping
                  </a>
                </p>
              </span>
              <div className="flex padding-bottom-1x">
                <b>Examples:</b>
                <Spaces count={2} />
                <button onClick={populateVCF} className="ref-link" id="vcfExampleButton">VCF</button>
                <Spaces count={2} />
                <button onClick={populateHGVS} className="ref-link" id="hgvsExampleButton">HGVS</button>
                <Spaces count={2} />
                <button onClick={populateProtAC} className="ref-link" id="protACExampleButton" title={protACTitle}>ProtAC</button>
              </div>

              <textarea
                id="main-textarea-search-field"
                className="main-textarea-search-field"
                value={searchTerm}
                placeholder="Paste variants in VCF or HGVS format"
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