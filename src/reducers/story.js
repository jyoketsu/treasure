import {
    GET_STORY_LIST,
    ADD_STORY,
} from '../actions/app';
const defaultState = {
    storyList: [],
};

const story = (state = defaultState, action) => {
    switch (action.type) {
        case GET_STORY_LIST:
            if (!action.error) {
                return {
                    ...state,
                    storyList: action.payload.result,
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
        default:
            return state;
    }
};

export default story;