import {FETCH_RANDOM_VIDEO, FETCH_MY_VIDEO, DELETE_VIDEO, UPDATE_VIDEO, ADD_VIDEO, CURRENT_VIDEO} from '../actions/videos'
const initialState = {
    MyVideos:[],
    RandVideos:[],
    currentVideo:null
}

export const videoReducer = (state = initialState, action) => {

    switch (action.type) {
        case FETCH_RANDOM_VIDEO:
            //console.log('MyVideos => ', action.RandVideos)
            return {
                ...state,
                RandVideos: [...action.RandVideos]
            }
        case FETCH_MY_VIDEO:
            //console.log('MyVideos => ', action.MyVideos)
            return {
                ...state,
                MyVideos: [...action.MyVideos]
            }
        case UPDATE_VIDEO:
            //console.log('MyVideos => ', action.RandVideos)
            return {
                ...state,
            }
        case DELETE_VIDEO:
            //console.log('MyVideos => ', action.RandVideos)
            return {
                ...state,
            }
        case ADD_VIDEO:
            return {
                ...state,
            }
        case CURRENT_VIDEO:
            return {
                ...state,
                currentVideo: action.video
            }
        default:
            return state
    }

}