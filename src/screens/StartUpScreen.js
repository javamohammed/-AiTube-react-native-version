import React, {useEffect} from 'react';
import {View, ActivityIndicator } from 'react-native';
import AsyncStorage  from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {authenticate, logout, startUp} from '../store/actions/user';
const StartUpScreen = props => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const asyncLogin = async ()=>{
            dispatch(startUp())
            const userData = await AsyncStorage.getItem('userDataAiTube')
            if(!userData){
                console.log('if 1 start ')
                const jumpToAction = DrawerActions.jumpTo('Home', { success: '' });
                props.navigation.dispatch(jumpToAction)
                return
            }
            const transformedData = JSON.parse(userData)
            const {expirationDate, token, userId, email } = transformedData
            //1585590343152 ---- 1585593001685 2658533
            if((new Date(expirationDate).getTime()) <= (new Date()).getTime() || !token || !userId){
                console.log('if 2 ')
                dispatch(logout())
                const jumpToAction = DrawerActions.jumpTo('Home', { success: '' });
                props.navigation.dispatch(jumpToAction)
                 return
            }
            //console.log(new Date().getTime(), '----',new Date(expirationDate).getTime())
            const expiryTime = new Date().getTime() - (new Date(expirationDate).getTime())
            dispatch(authenticate(token, userId, expiryTime, email))
            const jumpToAction = DrawerActions.jumpTo('Home', { success: 'login' });
            props.navigation.dispatch(jumpToAction)

        }
        asyncLogin()
    },[dispatch, props,logout, startUp, authenticate, DrawerActions])
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size='large' color="black"/>
        </View>
};

export default StartUpScreen;