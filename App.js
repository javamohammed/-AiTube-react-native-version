
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import {videoReducer} from './src/store/reducers/videos';
import {userReducer} from './src/store/reducers/user';
import ReduxThunk from "redux-thunk";
import NavigationContainer from './src/Navigation/NavigationContainer';
import FlashMessage from "react-native-flash-message";


const customMiddleWare = store => next => async action => {
    if(action.type === 'NEED_AUTH'){
      console.log("Middleware triggered 1:", action.type);
     //await store.dispatch(fetchRandomVideosAction(''))
      return;
    }else{
      console.log("Middleware triggered 2:", action.type);
      next(action);
    }

}

const rootReducer = combineReducers({
  videos: videoReducer,
  user: userReducer
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk,customMiddleWare));
const App = props => {
  return (
    <Provider store={store}>
      <NavigationContainer/>
      <FlashMessage position="top" />
    </Provider>
)
  };

export default App;
