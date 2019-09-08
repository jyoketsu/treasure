import React, { Component } from 'react';
import Story from '../story/Story';
import { connect } from 'react-redux';
import { getStoryDetail, } from '../../actions/app';
const mapStateToProps = state => ({
});

class PortalArticle extends Component {
    render() {
        return (
            <div className="portal-article">
                <Story readOnly={true} inline={true} />
            </div>
        );
    }

    componentDidMount() {
        const { getStoryDetail, id } = this.props;
        getStoryDetail(id);
    }
}

export default connect(
    mapStateToProps,
    { getStoryDetail }
)(PortalArticle);