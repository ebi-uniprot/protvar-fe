
import React, { Component, Fragment, Children, cloneElement } from 'react';
import Paginator from './pagination';

const Item = () => null;

class Page extends Component {

  state = {
    currentPage: null,
    itemsPerPage: null,
    rawItems: null
  }

  prepareChildren = () => {
    const { rawItems } = this.state;
    const { getstate } = this.props;
    const { PaginationComponents } = Paginator;
    const { ComponentWithState } = PaginationComponents;

    const passProps = child => {
      const children = child.props && child.props.children;

      // base case
      if ('undefined' === typeof children && child.type !== Item) {
        return child;
      }

      if (child.type === Item) {
        const { template } = child.props;
        const items = (null !== rawItems && 0 < rawItems.length)
          ? rawItems.map(item => template(item))
          : <h3>No records were found</h3>;

        return items;
      }

      return cloneElement(child, {
        ...child.props,
        children: Children.map(children, passProps),
      });
    }

    this.childrenWithProps = Children.map(this.props.children, passProps);

    this.forceUpdate();
  }

  componentWillReceiveProps = nextProps => {

    let { setTotal, currentPage, itemsPerPage, fetchPage } = nextProps;
    currentPage = parseInt(currentPage);
    itemsPerPage = parseInt(itemsPerPage);

    if (this.props.currentPage == currentPage && this.props.itemsPerPage == itemsPerPage) {
      return false;
    }

    fetchPage(currentPage, itemsPerPage)
      .then(results => {

        this.setState({
          currentPage,
          itemsPerPage,
          rawItems: results.items
        }, () => {
          setTotal(results.total);
          this.prepareChildren();
        });
      });
  }

  componentWillMount = () => {
    const { setTotal, setPage, setPageSize, fetchPage } = this.props;
    let { currentPage, itemsPerPage } = this.props;
    currentPage = parseInt(currentPage);
    itemsPerPage = parseInt(itemsPerPage);

    fetchPage(currentPage, itemsPerPage)
      .then(results => {

        this.setState({
          rawItems: results.items
        }, () => {
          setTotal(results.total);
          setPage(currentPage);
          setPageSize(itemsPerPage);
          this.prepareChildren();
        });
      });
  }

  render() {
    const { currentPage, itemsPerPage } = this.state;

    return(
      <Fragment>
        { this.childrenWithProps || null }
      </Fragment>
    );
  }

}

export default {
  Page,
  Item
};
