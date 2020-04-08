import { SIGNUP, LOGIN, LOGOUT, AUTHENTICATE, START_APP } from "../actions/user";
const initialState = {
    token: null,
    userId: 'adMUQpGz8aWQt33xI08VzniNXmX2',
    firstName:'Mido',
    email:'aaa@hotmail.com',
    start:0
}
export const userReducer = (state =initialState, action ) =>{
        switch (action.type) {
            case START_APP:
                return {
                    ...state,
                    start: 1
                }
            case SIGNUP:
                return {
                    ...state,
                    token:action.token,
                    userId: action.userId,
                    email:action.email
                }
            case LOGIN:
                return {
                    ...state,
                    token: action.token,
                    userId: action.userId,
                    email: action.email
                }
            case AUTHENTICATE:
                return {
                    ...state,
                    token: action.token,
                    userId: action.userId,
                    email: action.email
                }
            case LOGOUT:
                //console.log("initialState",initialState)
                return {
                    ...initialState,
                    start:1
                }
            default:
                return state
        }
}