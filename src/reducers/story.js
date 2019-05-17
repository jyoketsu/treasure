import {
    GET_STORY_LIST,
    ADD_STORY,
    EDIT_STORY,
    GET_STORY_DETAIL,
} from '../actions/app';
const defaultState = {
    storyList: [],
    storyNumber: 0,
    story: {},
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
                };
            } else {
                return state;
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
        case EDIT_STORY:
            if (!action.error) {
                let storyList = Object.assign([], state.storyList);
                storyList.unshift(action.payload.result);
                return {
                    ...state,
                    // storyList: storyList,
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
        default:
            return state;
    }
};

export default story;