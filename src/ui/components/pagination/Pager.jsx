
import React, { Component, Fragment, Children, cloneElement } from 'react';

const Next = () => null;
const Previous = () => null;
const First = () => null;
const Last = () => null;
const Steps = () => null;
const PageSizes = () => null;

class Pager extends Component {

  state = {
    currentPage: null,
    itemsPerPage: null,
    totalItems: null,
    pageSizeOptions: null
  }

  componentWillMount() {
    const { currentPage, itemsPerPage, totalItems } = this.props;

    this.setState({
      currentPage: parseInt(currentPage) || null,
      itemsPerPage: parseInt(itemsPerPage) || null,
      totalItems: parseInt(totalItems) || null
    }, this.prepareChildren);
  }

  componentWillReceiveProps(nextProps) {
    let { currentPage, itemsPerPage, totalItems } = nextProps;
    currentPage = parseInt(currentPage);
    totalItems = parseInt(totalItems);
    itemsPerPage = parseInt(itemsPerPage);

    this.setState({
      currentPage,
      itemsPerPage,
      totalItems
    }, this.prepareChildren);
  }

  prepareChildren = () => {
    const { template } = this.props;

    const passProps = child => {
      const children = child.props && child.props.children;

      // for plain text nodes
      if ('string' === typeof child) {
        return child;
      }

      if (child.type === Next) {
        const NextButton = template({
          label: ('undefined' !== typeof child.props.children)
            ? child.props.children
            : 'Next',
          onClick: this.nextPage
        });

        return <NextButton />;
      }

      else if (child.type === Previous) {
        const PreviousButton = template({
          label: ('undefined' !== typeof child.props.children)
            ? child.props.children
            : 'Previous',
          onClick: this.previousPage
        });

        return <PreviousButton />;
      }

      else if (child.type === First) {
        const FirstButton = template({
          label: ('undefined' !== typeof child.props.children)
            ? child.props.children
            : 'First',
          onClick: this.firstPage
        });

        return <FirstButton />;
      }

      else if (child.type === Last) {
        const LastButton = template({
          label: ('undefined' !== typeof child.props.children)
            ? child.props.children
            : 'Last',
          onClick: this.lastPage
        });

        return <LastButton />;
      }

      else if (child.type === Steps) {
        return this.generateSteps();
      }

      else if (child.type === PageSizes) {
        let { options } = child.props;

        if ('string' === typeof options) {
          options = options.split(',')
            .map(size => parseInt(size));
        }

        return this.generatePageSizeOptions(options);
      }

      return cloneElement(child, {
        ...child.props,
        children: Children.map(children, passProps),
      });
    }

    this.childrenWithProps = Children.map(this.props.children, passProps);

    this.forceUpdate();
  }

  nextPage = () => {
    const { nextPage } = this.props;
    nextPage();
  }

  previousPage = () => {
    const { previousPage } = this.props;
    previousPage();
  }

  firstPage = () => {
    const { firstPage } = this.props;
    firstPage();
  }

  lastPage = () => {
    const { lastPage } = this.props;
    lastPage();
  }

  setPage = page => {
    const { setPage } = this.props;
    setPage(page);
  }

  setPageSize = pageSize => {
    const { setPageSize } = this.props;
    setPageSize(pageSize);
  }

  generateSteps = () => {
    const { itemsPerPage, totalItems, currentPage } = this.state;
    const { template } = this.props;

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

  generatePageSizeOptions = sizes => {
    const { itemsPerPage } = this.state;
    const { template } = this.props;
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

  render() {
    return(
      <Fragment>
        { this.childrenWithProps || null }
      </Fragment>
    );
  }
}

export default {
  Pager,
  Next,
  Previous,
  First,
  Last,
  Steps,
  PageSizes
};
