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
      <section className="card--has-hover" role="button">
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
              <div id="search-button-group" className="search-button-group">
                <Button
                  onClick={() => window.open(API_URL + '/swagger-ui/#/', '_blank')}
                  className="button-bottom"
                >
                  PepVEP REST API
                </Button>
              </div>
            </section>
          </section>
        </div>
      </section>
    </div>
  </div>
}
export default RestApiComponent;