import {
    GET_STORY_LIST,
    CLEAR_STORY_LIST,
    ADD_STORY,
    MODIFY_STORY,
    DELETE_STORY,
    GET_STORY_DETAIL,
    CLEAR_STORY_DETAIL,
    LIKE_STORY,
    UPDATE_EXIF,
    AUDIT,
} from '../actions/app';

const defaultState = {
    storyList: [],
    storyNumber: 0,
    story: {},
    sortType: 1,
    sortOrder: 1,
    nowChannelKey: 'allSeries',
};

const story = (state = defaultState, action) => {
    switch (action.type) {
        case GET_STORY_LIST:
            if (!action.error) {
                let storyList = [];
                if (action.curPage === 1) {
                    storyList = action.payload.result;
                } else {
                    storyList = JSON.parse(JSON.stringify(state.storyList));
                    storyList = storyList.concat(action.payload.result)
                }
                return {
                    ...state,
                    storyList: storyList,
                    storyNumber: action.payload.totalNumber,
                    sortType: action.sortType,
                    sortOrder: action.sortOrder,
                    nowChannelKey: action.channelKey,
                };
            } else {
                return state;
            }
        case CLEAR_STORY_LIST:
            return {
                ...state,
                storyNumber: 0,
                storyList: [],
            }

        case ADD_STORY:
            if (!action.error) {
                let storyList = Object.assign([], state.storyList);
                storyList.unshift(action.payload.result);
                return {
                    ...state,
                    storyList: storyList,
                };
            } else {
                return state;
            }
        case MODIFY_STORY:
            if (!action.error) {
                let storyList = Object.assign([], state.storyList);
                for (let i = 0; i < storyList.length; i++) {
                    if (storyList[i]._key === action.payload.result._key) {
                        storyList[i] = action.payload.result;
                        break;
                    }
                }
                return {
                    ...state,
                    storyList: storyList,
                };
            } else {
                return state;
            }
        case DELETE_STORY:
            if (!action.error) {
                let storyList = Object.assign([], state.storyList);
                for (let i = 0; i < storyList.length; i++) {
                    if (storyList[i]._key === action.storyKey) {
                        storyList.splice(i, 1);
                        break;
                    }
                }
                return {
                    ...state,
                    storyList: storyList,
                };
            } else {
                return state;
            }
        case GET_STORY_DETAIL:
            if (!action.error) {
                return {
                    ...state,
                    story: action.payload.result,
                };
            } else {
                return state;
            }
        case CLEAR_STORY_DETAIL:
            return {
                ...state,
                story: {}
            }
        case UPDATE_EXIF:
            return {
                ...state,
                story: action.story,
            }
        case LIKE_STORY:
            if (!action.error) {
                let storyList = Object.assign([], state.storyList);
                for (let i = 0; i < storyList.length; i++) {
                    let story = storyList[i];
                    if (story._key === action.storyKey) {
                        if (story.islike) {
                            story.islike = 0;
                            story.likeNumber = story.likeNumber - 1;
                        } else {
                            story.islike = 1;
                            story.likeNumber = story.likeNumber + 1;
                        }
                        break;
                    }
                }
                return {
                    ...state,
                    storyList: storyList,
                };
            } else {
                return state;
            }
        case AUDIT:
            if (!action.error) {
                let storyList = Object.assign([], state.storyList);
                for (let i = 0; i < storyList.length; i++) {
                    let story = storyList[i];
                    if (story._key === action.storyKey) {
                        story.pass = action.passOrNot;
                        break;
                    }
                }
                return {
                    ...state,
                };
            } else {
                return state;
            }
        default:
            return state;
    }
};

export default story;