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
        let content;
        switch (story.type) {
            case 6:
                content = <Story readOnly={true} inline={true} />
                break;
            case 9:
                content = <Article readOnly={true} inline={true} />
                break;
            case 15:
                content =
                    <iframe
                        title={story.title}
                        src={story.url}
                        frameBorder="0"
                        width="100%"
                        height={document.body.clientHeight}
                    ></iframe>;
                break;
            default:
                break;
        }
        return (
            <div className={`portal-article ${story.type === 15 ? 'link' : ''}`}>
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