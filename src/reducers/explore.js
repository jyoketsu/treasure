import {
    GET_EXPLORE  
} from '../actions/app';

const defaultState = {   
    exploreData:null,
};

const explore = (state = defaultState, action) => {
    switch (action.type) {
        case GET_EXPLORE:
            if (!action.error) {
                return {
                    ...state,
                    exploreData: action.payload.result,
                }
            } else {
                return state;
            }
       
        default:
            return state;
    }
};

export default explore;
