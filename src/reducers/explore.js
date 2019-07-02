import {
    GET_EXPLORE,
    GET_EXPLOREHOT  
} from '../actions/app';

const defaultState = {   
    exploreData:null,
    exploreHot:''
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
        case GET_EXPLOREHOT:   
            return {
                ...state,
                exploreHot: action.payload,
            }       
           
        default:
            return state;
    }
};

export default explore;
