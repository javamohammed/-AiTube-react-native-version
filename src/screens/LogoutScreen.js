import React, {useEffect} from 'react';
import {View, ActivityIndicator } from 'react-native';
import AsyncStorage  from '@react-native-community/async-storage';
import { DrawerActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout} from '../store/actions/user';
const LogoutScreen = props => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const asyncLogin = async ()=>{
            //const userData = await AsyncStorage.getItem('userDataAiTube')
            dispatch(logout())
            console.log('if 1 finish ')
            const jumpToAction = DrawerActions.jumpTo('Home', { success: '' });
            props.navigation.dispatch(jumpToAction)
            return
            
        }
        asyncLogin()
    },[dispatch, props, logout, DrawerActions])
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size='large' color="black"/>
        </View>
};

export default LogoutScreen;