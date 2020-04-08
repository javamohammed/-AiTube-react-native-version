import AsyncStorage from '@react-native-community/async-storage';
import Env from '../../environment';
const apiUrlAuthSignIn = Env.prod.apiUrlAuthSignIn;
const apiUrlAuthSignUp = Env.prod.apiUrlAuthSignUp;
const urlFireBase = Env.prod.urlFireBase;
export const START_APP = 'START_APP'
export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const AUTHENTICATE = 'AUTHENTICATE'


export const startUp = () => {
    return {
        type: START_APP
    }
}

export const logout = () => {
    AsyncStorage.removeItem('userDataAiTube')
    return {
        type: LOGOUT
    }
}


export const signup = (first_name,last_name, email, password ,country ) => {
     return async dispatch => {
        const response = await fetch(
            apiUrlAuthSignUp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                    returnSecureToken: true
                })
            }
        );
        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        await fetch(`${urlFireBase}/users.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                country
            })
        })

        dispatch({
            type: SIGNUP,
            token: resData.idToken,
            userId: resData.localId,
            email:email
        });
    };
}
export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
           apiUrlAuthSignIn, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        //console.log(resData);
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn)*9000)
        saveAuthToStorage(resData.idToken, resData.localId, expirationDate, email)
        //const userData = await AsyncStorage.getItem('userDataAiTube')
        //console.log('userDataAiTube:::', userData)
        dispatch({
            type: LOGIN,
            token: resData.idToken,
            userId: resData.localId,
            email: email
        });
    };
};
export const saveImage = (token, userId, uriImage) => {
    return dispatch => {
        dispatch({
            type: AUTHENTICATE,
            token: token,
            userId: userId
        })
    }
}
export const authenticate = (token, userId,email) => {
    console.log("authenticate<==========")
    return dispatch => {
        dispatch({
            type: AUTHENTICATE,
            token: token,
            userId: userId,
            email:email
        })
    }
}
const saveAuthToStorage = (token, userId, expirationDate, email) => {
    AsyncStorage.setItem('userDataAiTube', JSON.stringify({
        email:email,
        token: token,
        userId: userId,
        expirationDate: expirationDate.toISOString()
    }))
}