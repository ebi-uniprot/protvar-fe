import React, { Component, Fragment, Children, cloneElement } from 'react';

const Page = () => null;
const Item = () => null;
const Pager = () => null;
const Steps = () => null;
const Next = () => null;
const Previous = () => null;
const First = () => null;
const Last = () => null;
const PageSizes = () => null;

class Pagination extends Component {

  state = {
    currentPage: null,
    itemsPerPage: null,
    totalItems: null,
    items: null,
    loading: false
  }

  innerComponents = null;
  loadingComponent = <h3>Loading...</h3>;
  buttonsTemplate = details => () => <button>{details.label}</button>;

  constructor(props) {
    super(props);
    const LoadingComponent = props.loader;

    if ('undefined' !== typeof loader) {
      this.loadingComponent = <LoadingComponent />;
    }
  }

  componentWillMount() {

    this.addPropsToState()
      .then(() => {
        const { currentPage, itemsPerPage } = this.state;
        this.fetchPage(currentPage, itemsPerPage)
      });
  }

  componentDidMount() {
    this.prepareChildren();
  }

  fetchPage = (currentPage, itemsPerPage) => {
    const fetchPage = this.props.fetchPage || (() => []);

    this.pageWillLoad();

    fetchPage(currentPage, itemsPerPage)
      .then(results => {

        this.setState({
          currentPage: parseInt(currentPage),
          items: results.items,
          totalItems: results.total
        }, this.pageDidLoad);
      });
  }

  pageWillLoad() {
    const { beforeLoad } = this.props;

    this.setState({
      loading: true
    }, () => {
      if ('function' === typeof beforeLoad) {
        beforeLoad();
      }

      this.prepareChildren();
    });
  }

  pageDidLoad() {
    const { afterLoad } = this.props;

    this.setState({
      loading: false
    }, () => {
      if ('function' === typeof afterLoad) {
        afterLoad();
      }

      this.prepareChildren();
    });
  }

  async addPropsToState() {
    const { currentPage, itemsPerPage } = this.props;
    const state = {
      currentPage: parseInt(currentPage),
      itemsPerPage: parseInt(itemsPerPage)
    };

    return new Promise(resolve => this.setState(state, resolve));
  }

  prepareChildren = () => {
    const { loading } = this.state;
    const NoItems = this.props.empty || (<h3>No records were found</h3>);

    if (loading) {
      this.innerComponents = this.loadingComponent;
      this.forceUpdate();
      return;
    }

    const replaceComponents = comp => {
      const children = comp.props && comp.props.children;
      let template = null;
      let NewComponent = null;

      // base cases
      if ('string' === typeof comp) {
        return comp;
      }

      if ('undefined' === typeof children) {
        if (Page === comp.type && Pager === comp.type) {
          return comp;
        }
      }

      switch(comp.type) {
        // 'break' statements are redundant, but are added for the extra clarity.
        case Pager:
          template = comp.props.template;

          if (template) {
            this.buttonsTemplate = template;
          }
          // No break here. Fall-through to the below case.

        // Wrapper Components
        case Page:
        case Pager:
          NewComponent = props => {
            return(
              <Fragment>
                { props.children }
              </Fragment>
            );
          }

          return cloneElement(<NewComponent />, {
            ...comp.props,
            children: Children.map(children, replaceComponents)
          });
          break;

        case Item:
          const { items } = this.state;
          template = comp.props.template;
          NewComponent = (null !== items && 0 < items.length)
            ? items.map(item => template(item))
            : <NoItems />;

          return NewComponent;
          break;

        case Steps:
          template = comp.props.template || this.buttonsTemplate;
          return this.generateSteps(template);
          break;

        case Next:
        case Previous:
        case First:
        case Last:
          template = comp.props.template || this.buttonsTemplate
          NewComponent = template({
            label: ('undefined' !== typeof children)
              ? children
              : comp.type.name,
            onClick: (() => {
              switch(comp.type.name) {
                case 'Next': return this.nextPage;
                case 'Previous': return this.previousPage;
                case 'First': return this.firstPage;
                case 'Last': return this.lastPage;
              }
            })()
          });

          return <NewComponent />;
          break;

        case PageSizes:
          let { options } = comp.props;
          template = comp.props.template || this.buttonsTemplate;

          if ('string' === typeof options) {
            options = options.split(',')
              .map(size => parseInt(size));
          }

          return this.generatePageSizeOptions(options, template);
          break;

        default:
          return cloneElement(comp, {
            ...comp.props,
            children: Children.map(children, replaceComponents)
          });
      }
    }

    this.innerComponents = Children.map(this.props.children, replaceComponents);
    this.forceUpdate();
  }

  generateSteps = template => {
    const { itemsPerPage, totalItems, currentPage } = this.state;

    if ('number' !== typeof totalItems || 0 > totalItems) {
      return null;
    }

    if ('number' !== typeof itemsPerPage || 0 > itemsPerPage) {
      return null;
    }

    const howMany = parseInt(totalItems / itemsPerPage) + 1;
    let Step = null;

    if (0 > howMany || isNaN(howMany)) {
      return null;
    }

    const steps = Array(howMany)
      .fill(null)
      .map((x, i) => {
        Step = template({
          label: i + 1,
          classes: (i + 1 === currentPage) ? 'success' : '',
          onClick: () => this.setPage(i+1)
        });

        return <Step />;
      });

    return steps;
  }

  setPage = page => {
    const { itemsPerPage } = this.state;
    this.fetchPage(page, itemsPerPage)
  }

  nextPage = () => {
    let { currentPage, itemsPerPage, totalItems } = this.state;

    if (totalItems < currentPage * itemsPerPage) {
      return false;
    }

    this.setPage(++currentPage);
  }

  previousPage = () => {
    let { currentPage, itemsPerPage, totalItems } = this.state;

    if (0 >= (currentPage - 1) * itemsPerPage) {
      return false;
    }

    this.setPage(--currentPage);
  }

  firstPage = () => {
    this.setPage(1);
  }

  lastPage = () => {
    const { totalItems, itemsPerPage } = this.state;
    const page = (totalItems / itemsPerPage) + 1;
    this.setPage(page);
  }

  generatePageSizeOptions = (sizes, template) => {
    const { itemsPerPage } = this.state;
    let EachOption = null;
    sizes = sizes || [5, 10, 25];

    const options = sizes
      .map((x, i) => {
        EachOption = template({
          label: x,
          classes: (x === itemsPerPage) ? 'success' : '',
          onClick: () => this.setPageSize(x)
        });

        return <EachOption />;
      });

    return options;
  }

  setPageSize = newPageSize => {
    const { currentPage, totalItems } = this.state;
    const calculatedCurrentPage = (totalItems < currentPage * newPageSize)
      ? parseInt((totalItems / newPageSize) + 1)
      : currentPage;

    this.setState({
      itemsPerPage: parseInt(newPageSize)
    }, () => {

      if (null !== calculatedCurrentPage) {
        this.setPage(calculatedCurrentPage)
      }

      this.prepareChildren();
    });
  }

  render() {
    return(
      <Fragment>
        { this.innerComponents }
      </Fragment>
    );
  }
}

export default {
    Pagination,
    Page,
    Item,
    Pager,
    Steps,
    Next,
    Previous,
    First,
    Last,
    PageSizes
};
