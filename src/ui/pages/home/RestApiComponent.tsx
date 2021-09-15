import { API_URL } from '../../../constants/const';
import Button from '../../elements/form/Button';

function RestApiComponent() {
  return <div id="api" className="card-table api">
    <div className="card">
      <section className="card__actions">
        <span className="card-header">
          <p>
            <b>PepVEP REST API</b>
          </p>
        </span>
      </section>
      <section className="card--has-hover top-row" role="button">
        <div className="card__content">
          <section className="uniprot-card">
            <section className="uniprot-card__left">
              <b>
                PepVEP's REST API is a programmatic way to obtain information from
                PepVEP via Simple URL-based queries
              </b>
              <br />
              You can query:
              <ul>
                <li>
                  Whole genes/proteins/structures specific residue ranges in proteins
                  or protein structures or{' '}
                </li>
                <li>
                  Genomic ranges in genes a list of variants using several different
                  formats
                </li>
              </ul>
              Click below for all PepVEP REST API documentation

            </section>
          </section>
        </div>
      </section>
      <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Button
          onClick={() => window.open(API_URL + '/swagger-ui/#/', '_blank')}
          className="width100"
        >
          PepVEP REST API
        </Button>
      </div>
    </div>
  </div>
}
export default RestApiComponent;