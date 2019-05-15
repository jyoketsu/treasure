import {
    GET_STORY_LIST,
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
        default:
            return state;
    }
};

export default story;