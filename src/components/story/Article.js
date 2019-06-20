import React, { Component } from 'react';
import './Article.css'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { getStoryDetail, clearStoryDetail, } from '../../actions/app';

const mapStateToProps = state => ({
    userId: state.auth.user ? state.auth.user._key : null,
    story: state.story.story,
    nowStationKey: state.station.nowStationKey,
});

class Article extends Component {
    handleToEdit() {
        const { history, location } = this.props;
        history.push(`editArticle${location.search}`);
    }

    render() {
        const { story, userId, nowStationKey } = this.props;
        const { userKey } = story;
        return (
            <div
                className="app-content story-container article-display"
                ref={eidtStory => this.eidtStoryRef = eidtStory}
            >
                <div className="main-content story-content"
                    style={{
                        minHeight: `${window.innerHeight}px`
                    }}
                >
                    <h1>{story ? story.title : ''}</h1>
                    {
                        userId === userKey && nowStationKey !== 'all' ? <span className="to-edit-story" onClick={this.handleToEdit.bind(this)}>编辑</span> : null
                    }
                    <CKEditor
                        editor={ClassicEditor}
                        data={story ? story.content : ''}
                        config={{
                            toolbar: [],
                        }}
                        disabled={true}
                    />
                </div>
            </div>
        );
    }

    componentWillMount() {
        this.props.clearStoryDetail();
    }

    componentDidMount() {
        const { location, getStoryDetail, } = this.props;
        let storyKey = util.common.getSearchParamValue(location.search, 'key');
        getStoryDetail(storyKey);
    }
}

export default connect(
    mapStateToProps,
    { getStoryDetail, clearStoryDetail, },
)(Article);