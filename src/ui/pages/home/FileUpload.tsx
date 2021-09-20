import React, { useRef } from 'react'
import Button from '../../elements/form/Button';
import { VCF_FORMAT_INFO_URL } from '../../../constants/ExternalUrls';
import { FileLoadFun } from '../../../utills/AppHelper';

interface FileUploadProps {
  fetchFileResult: FileLoadFun
  isLoading: boolean
}

function FileUpload(props: FileUploadProps) {
  const uploadInputField = useRef<HTMLInputElement>(null);

  function viewResult(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    if (!target.files || !(target.files.length > 0)) {
      return;
    }
    var file = target.files[0];
    props.fetchFileResult(file);
  }

  return <div id="upload" className="card-table upload">
    <div className="card" >
      <section className="card__actions">
        <span className="card-header">
          <p>
            <b>Upload file</b>
          </p>
        </span>
      </section>
      <section className="card--has-hover top-row" role="button">
        <div className="card__content">
          <section className="uniprot-card">
            <section className="uniprot-card__left">
              <p>
                <b>PepVEP will interpret only the first five fields of the VCF</b><br />
                #CHROM POS ID REF ALT<br />
                Missing values can be specified with a dot (‘.’){' '}
                <a target="_blank" rel="noreferrer" href={VCF_FORMAT_INFO_URL} className="ref-link">more info</a><br /><br />
                <b>PepVEP also supports HGVS in below format</b><br />
                {"NC_000010.11:g.121479868C>G"}<br />
              </p>
            </section>
          </section>
        </div>
      </section>
      <input
        id="myInput"
        type="file"
        style={{ display: 'none' }}
        ref={uploadInputField}
        onChange={viewResult}
      />
      <div className="search-button-group">
        <Button
          onClick={props.isLoading ? () => null : () => uploadInputField.current?.click()}
          className="button-primary"
        >
          {props.isLoading ? "Loading..." : "Upload File"}
        </Button>
      </div>
    </div>
  </div>
}
export default FileUpload;