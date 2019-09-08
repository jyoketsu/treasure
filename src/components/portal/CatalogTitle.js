import React, { Component } from 'react';
import './CatalogTitle.css';

class CatalogTitle extends Component {
    render() {
        const { title } = this.props;
        return (
            <div className="catalog-title"><h1>{title}</h1></div>
        );
    }
}

export default CatalogTitle;
