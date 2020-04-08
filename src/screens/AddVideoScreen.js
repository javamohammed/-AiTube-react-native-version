import React, { useState, useCallback, useReducer } from "react";
import { StyleSheet, ActivityIndicator, Text, TextInput, View, ScrollView, Alert, KeyboardAvoidingView } from "react-native";
import { useDispatch,useSelector } from "react-redux";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { DrawerActions } from '@react-navigation/native';
import HeaderButton from '../components/UI/HeaderButton';
//import NavBar from '../components/NavBar';
import ButtonSave from '../components/UI/ButtonComponent';
import Input from '../components/UI/Input';
import Card from "../components/UI/Card";
import NavBar from '../components/NavBar';
import {checkIfAuth ,addVideo, updateVideoAction} from "../store/actions/videos";
const FORM_INPUT_VALIDATE = "FORM_INPUT_VALIDATE";
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_VALIDATE) {
        const updateValues = {
            ...state.inputsValues,
            [action.input]: action.value
        };
        const updateValidities = {
            ...state.inputsValidities,
            [action.input]: action.isValid
        };
        let updateFormIsValid = true;
        for (const key in updateValidities) {
            updateFormIsValid = updateFormIsValid && updateValidities[key];
        }
        return {
            inputsValues: updateValues,
            inputsValidities: updateValidities,
            formIsValid: updateFormIsValid
        };
    }
    return state;
};
const AddVideoScreen = props =>{
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector(state => state.user)
    const tag =  props.route?.params?.tag 
    const title =  props.route?.params?.title 
    const videoId = props.route?.params?.videoId
    const [formState, dispatchFromState] = useReducer(formReducer, {
        inputsValues: {
            videoId: videoId ? videoId : "",
            tag: tag ? tag : "",
        },
        inputsValidities: {
            tag: tag ? true : false,
            videoId: videoId ? true : false,
        },
        formIsValid: videoId ? true : false,
    });
    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            //console.log('inputValue =>', inputValue)
            dispatchFromState({
                type: FORM_INPUT_VALIDATE,
                isValid: inputValidity,
                value: inputValue,
                input: inputIdentifier
            });
        },
        [dispatchFromState]
    );
    const submitHandler = useCallback( async() => {
        if (!formState.formIsValid) {
            Alert.alert("wrong input!", "Please check the errors in the form", [{
                text: "Oky"
            }]);
            return;
        }
        /*
         Alert.alert("Nice!", "All Works :)", [{
             text: "Oky"
         }]);*/
         setIsLoading(true)
         let success = 'add'
         if (videoId) {
            const result = await dispatch(updateVideoAction(videoId, formState.inputsValues.tag, user.userId, user.token))
            if(result === 'Network_error'){
                Alert.alert("Network_error!", "Please try again!!", [{
                    text: "Oky"
                }]);
                setIsLoading(false)
                return;
            }
            success = 'update'
         }else{
             //Id_video, tag, userId, token,first_name wWYnR3ofhGQ
           const result =  await dispatch(addVideo(formState.inputsValues.videoId, formState.inputsValues.tag, user.userId, user.token, user.firstName))
            //const result =  await dispatch(addVideo("wWYnR3ofhGQ", formState.inputsValues.tag, user.userId, user.token, user.firstName))
            if(result === 'error'){
                Alert.alert("Error!", "This Video not found", [{
                    text: "Oky"
                }]);
                setIsLoading(false)
                return;
            }
            if(result === 'exist'){
                Alert.alert("Error!", "This Video Already added!", [{
                    text: "Oky"
                }]);
                setIsLoading(false)
                return;
            }
         }
         
        const checkIfAuthVar = await checkIfAuth()
        let type = "success"
        if(checkIfAuthVar === 0){
        type = "error"
        }
        setIsLoading(false)
        if(props.route.params){
            props.route.params = undefined
        }
        props.navigation.navigate('My Videos',  { success: success, type: type })
    }, [formState, addVideo, dispatch, user, props, DrawerActions]);
    return (
        <View style={styles.containerForm}>
            {!videoId && <NavBar navigation={props.navigation}/>}
            <View style={styles.containerTileScreen}>
                <Text style={styles.tileScreen}>
                    {videoId && title}
                    {!videoId && "Add New Video :"}
                </Text>
            </View>
            <Card>
            {!videoId &&
            <Input
                id='videoId'
                label='ID Video'
                keyboardType='default'
                autoCapitalize='sentences'
                autoCorrect
                returnKeyType='next'
                errorText = 'Please, Enter a valid videoId'
                onInputChange={inputChangeHandler}
                initialValue={formState.inputsValues.videoId}
                initiallyValid={formState.inputsValidities.videoId}
                required
                CommonWith= {{labelWith:'12%', inputWith:'80%'}}
            />}
             <Input
                id='tag'
                label='Tag'
                keyboardType='default'
                returnKeyType='next'
                errorText = 'Please, Enter a valid Tag'
                onInputChange={inputChangeHandler}
                initialValue={formState.inputsValues.tag}
                initiallyValid={formState.inputsValidities.tag}
                required
                CommonWith= {{labelWith:'12%', inputWith:'80%'}}
            />
            {isLoading ? (<ActivityIndicator size="large" color="red" />)
            :
            (
                <ButtonSave paddingHorizontal={styles.button} onPress={submitHandler}>Save</ButtonSave>

            )

            }
            </Card>
        </View>
        )
}
AddVideoScreen.navigationOptions = navData => {
    return {
         headerShown: true,
        headerTitle:'',
        headerLeft: ()=>{
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Menu"
              iconName='menu'
              onPress={() => {
                navData.navigation.toggleDrawer();
              }}
            />
          </HeaderButtons>
        }
    }
}
const styles =StyleSheet.create({
    containerForm :{
        flex:1,
    },
    tileScreen :{
        fontSize:20,
        fontFamily:'lobster-regular'
    },
    containerTileScreen:{
        justifyContent:'center',
        marginHorizontal:'30%',
        marginBottom:30,
        marginTop: 20,
        borderBottomColor:'gray'
    },
    button: {
        paddingHorizontal: 30,
    }
})
export default AddVideoScreen