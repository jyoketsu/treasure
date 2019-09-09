import React, { Component } from 'react';
import Story from '../story/Story';
import Article from '../story/Article';
import { connect } from 'react-redux';
import { getStoryDetail, } from '../../actions/app';
const mapStateToProps = state => ({
    story: state.story.story,
});

class PortalArticle extends Component {
    render() {
        const { story } = this.props;
        const content = story
            ? (story.type === 9
                ? <Article readOnly={true} inline={true} />
                : <Story readOnly={true} inline={true} />)
            : null;
        return (
            <div className="portal-article">
                {content}
            </div>
        );
    }

    componentDidMount() {
        const { getStoryDetail, id } = this.props;
        getStoryDetail(id);
    }

    componentDidUpdate(prevProps) {
        const { getStoryDetail, id } = this.props;
        if (id !== prevProps.id) {
            getStoryDetail(id);
        }
    }
}

export default connect(
    mapStateToProps,
    { getStoryDetail }
)(PortalArticle);