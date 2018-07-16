
import React, { Component, Fragment, Children, cloneElement } from 'react';
import PageComponents from './page';
import PagerComponents from './pager';

class Pagination extends Component {

  state = {
    currentPage: null,
    itemsPerPage: null,
    totalItems: null,
    loading: false
  }

  prepareChildren = () => {
    const { currentPage, itemsPerPage, totalItems, loading } = this.state;
    const { Page } = PageComponents;
    const { Pager } = PagerComponents;
    let cloneProps = {};

    const LoaderComponent = this.props.loader || (() => <b>Loading Data...</b>);
    
    if (loading) {

      this.childrenWithProps = Children.map(this.props.children, () => <h3>test</h3>);
      this.forceUpdate();

      // this.childrenWithProps = [cloneElement(LoaderComponent, LoaderComponent.props)];
      // this.forceUpdate();
      // return;
      // this.childrenWithProps = [<LoaderComponent key="1" />];
      // this.forceUpdate();
      return;
    }
console.log(">>> passed loading");
    const passProps = child => {
      const children = child.props && child.props.children;



      // base case
      if ('undefined' === typeof children) {
        return child;
      }

      if (child.type === Page) {
        cloneProps = {
          setTotal: this.setTotal,
          setPage: this.setPage,
          setPageSize: this.setPageSize,
          fetchPage: this.fetchPage,
          getstate: this.getstate         // needs to be lower case
        };

        if (null !== currentPage) {
          cloneProps.currentPage = currentPage;
        }

        if (null !== itemsPerPage) {
          cloneProps.itemsPerPage = itemsPerPage;
        }

        return cloneElement(child, cloneProps);
      }

      else if (child.type === Pager) {
        return cloneElement(child, {
          nextPage: this.nextPage,
          previousPage: this.previousPage,
          firstPage: this.firstPage,
          lastPage: this.lastPage,
          setPage: this.setPage,
          setPageSize: this.setPageSize,
          getstate: this.getstate,      // needs to be lower case
          totalItems,
          currentPage,
          itemsPerPage
        });
      }

      return cloneElement(child, {
        ...child.props,
        children: Children.map(children, passProps),
      });
    };

    this.childrenWithProps = Children.map(this.props.children, passProps);

    this.forceUpdate();
  }

  getstate = () => this.state;

  componentDidMount() {
    const total = this.props.total || null;

    this.setState({
      totalItems: total
    }, this.prepareChildren);
  }

  setTotal = total => {
    this.setState({
      totalItems: parseInt(total)
    }, this.prepareChildren);
  }

  setPage = page => {
    this.setState({
      currentPage: parseInt(page)
    }, this.prepareChildren);
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

  fetchPage = (page, size) => {
    const fetchPage = this.props.fetchPage || (() => []);

    this.pageWillLoad();

    return fetchPage(page, size)
      .then(results => {
        this.pageDidLoad();
        return results;
      });
  }

  pageWillLoad = () => {
    const { pageWillLoad } = this.props;

    this.setState({
      loading: true
    }, () => {
      if ('function' === typeof pageWillLoad) {
        pageWillLoad();
      }

      // this.prepareChildren();
    });
  }

  pageDidLoad = () => {
    const { pageDidLoad } = this.props;

    this.setState({
      loading: false
    }, () => {
      if ('function' === typeof pageDidLoad) {
        pageDidLoad();
      }

      // this.prepareChildren();
    });
  }

  render() {
    const { currentPage, itemsPerPage, loading } = this.state;
console.log("is loading:", loading);
    // if (loading) {
    //   return <LoaderComponent />;
    // }

    return (
      <Fragment>
        Pagination Wrapper = Page: {currentPage}; Items per page: {itemsPerPage}
        { this.childrenWithProps }
      </Fragment>
    );
  }
}

export default {
  PaginationComponents: {
    Pagination
  },
  PageComponents,
  PagerComponents
};
