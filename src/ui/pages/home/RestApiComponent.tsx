import { API_URL } from '../../../constants/const';
import Button from '../../elements/form/Button';

function RestApiComponent() {
  return <div id="api" className="card-table api">
    <div className="card">
      <section className="card__actions">
        <span className="card-header">
          <p>
            <b>Access ProtVar REST API</b>
          </p>
        </span>
      </section>
      <section className="card--has-hover top-row" role="button">
        <div className="card__content">
          <section className="uniprot-card">
            <section className="uniprot-card__left">
              <b>
                REST API is a programmatic way to obtain information from ProtVar
              </b>
              <br />
              You can query:
              <ul>
                <li>Whole genes, proteins or structures</li>
                <li>Specific residues or ranges in genes, proteins or protein structures</li>
                <li>Genomic positions or ranges using several different formats</li>
              </ul>
            </section>
          </section>
        </div>
      </section>
      <div className="search-button-group">
        <Button
          onClick={() => window.open(API_URL + '/docs', '_blank')}
          className="button-primary"
          id="restApiButton"
        >
          ProtVar REST API
        </Button>
      </div>
    </div>
  </div>
}
export default RestApiComponent;