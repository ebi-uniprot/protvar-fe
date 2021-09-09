import React, { useState, useRef } from 'react'
import Button from '../../elements/form/Button';
import PapaParse from 'papaparse';
import { NO_OF_ITEMS_PER_PAGE } from '../../../constants/const';
import { VCF_FORMAT_INFO_URL } from '../../../constants/ExternalUrls';

interface FileUploadProps {
  fetchResult: any
  isLoading: boolean
}

function FileUpload(props: FileUploadProps) {
  const uploadInputField = useRef<HTMLInputElement>(null);
  const [isFileSelected, setIsFileSelected] = useState(false)

  function viewResult(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    if (!target.files || !(target.files.length > 0)) {
      return;
    }
    var file = target.files[0];
    var noOfLines = 0;
    PapaParse.parse(file, {
      step: (row, parser) => {
        noOfLines = noOfLines + 1;
      },
      complete: () => {
        console.log('lines 2=>' + noOfLines);
        var page = {
          currentPage: 1,
          nextPage: true,
          previousPage: false,
          totalItems: noOfLines,
          itemsPerPage: NO_OF_ITEMS_PER_PAGE
        };
        setIsFileSelected(true)
        props.fetchResult(file, page, true, false, null);
      }
    });
  }

  return <div id="upload" className="card-table upload">
    <div className="card">
      <section className="card__actions">
        <span className="card-header">
          <p>
            <b>File Upload</b>
          </p>
        </span>
      </section>
      <section className="card--has-hover" role="button">
        <div className="card__content">
          <section className="uniprot-card">
            <section className="uniprot-card__left">
              <p>
                <b>PepVEP will interpret only the first five fields of the VCF</b><br />
                #CHROM POS ID REF ALT<br />
                Missing values should be specified with a dot (‘.’){' '}
                <a target="_blank" rel="noreferrer" href={VCF_FORMAT_INFO_URL} className="ref-link">more info</a><br /><br />
                <b>PepVEP also supports hgvs in below format</b><br />
                {"NC_000010.11:g.121479868C>G"}<br />
              </p>

              <div id="search-button-group" className="search-button-group">
                <input
                  id="myInput"
                  type="file"
                  style={{ display: 'none' }}
                  ref={uploadInputField}
                  onChange={viewResult}
                />
                <Button
                  onClick={isFileSelected ? () => null : () => uploadInputField.current?.click()}
                  className="button-primary button-bottom"
                >
                  {isFileSelected ? "Loading..." : "Upload File"}
                </Button>
              </div>
            </section>
          </section>
        </div>
      </section>
    </div>
  </div>
}
export default FileUpload;