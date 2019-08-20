import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

class PublicationsList extends Component {
  state = {
    displayList: false,
    listPositoin: {
      top: 0,
      left: 0,
    },
  };

  toggleDisplayList = (event) => {
    if (event.target === event.currentTarget) {
      const { displayList } = this.state;
      const node = ReactDom.findDOMNode(this);

      const rect = node.getBoundingClientRect();

      const doc = document.documentElement;
      const docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

      this.setState({
        displayList: !displayList,
        listPositoin: {
          top: rect.top + rect.height + docTop,
          left: rect.left,
        },
      });
    }
  }

  render() {
    const {
      displayList,
      listPositoin,
    } = this.state;

    const {
      title,
      items,
    } = this.props;

    const showItemsClassName = (displayList)
      ? 'publications-list__items-wrapper--visible'
      : '';

    return (
      <div
        className={`publications-list ${(displayList) && 'publications-list--open'}`}
        onClick={e => this.toggleDisplayList(e)}
        role="button"
      >
        {title || ''}
        <div
          className={`publications-list__items-wrapper ${showItemsClassName}`}
          style={{ top: `${listPositoin.top}px`, left: `${listPositoin.left}px` }}
        >
          {items || ''}
        </div>
      </div>
    );
  }
}

PublicationsList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.element.isRequired,
};

export default PublicationsList;
