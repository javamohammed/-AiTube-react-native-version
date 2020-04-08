import React, { useEffect, useCallback, useReducer,useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from "react-native";
import { DrawerActions } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import NavBar from '../components/NavBar';
import ButtonSave from '../components/UI/ButtonComponent';
import Input from '../components/UI/Input';
import { login } from "../store/actions/user";
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
const LoginScreen = props => {
    const dispatch = useDispatch()
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFromState] = useReducer(formReducer, {
        inputsValues: {
            email: "",
            password: "",
        },
        inputsValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
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
    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{
                text: 'Okay'
            }]);
        }
    }, [error]);
    const submitHandler =  useCallback( async() => {
        if (!formState.formIsValid) {
            Alert.alert("wrong input!", "Please check the errors in the form", [{
                text: "Oky"
            }]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(login(
                formState.inputsValues.email,
                formState.inputsValues.password
                ))
                const jumpToAction = DrawerActions.jumpTo('Home', { success: 'login' });
                props.navigation.dispatch(jumpToAction)
        } catch (err) {
             setError(err.message);
             setIsLoading(false);
        }
    }, [formState, login, dispatch, props, DrawerActions]);
    return (
        <ScrollView style={styles.containerForm}>
            <NavBar onPress={()=>props.navigation.navigate('Account')} navigation={props.navigation}/>
            <View style={styles.containerTileScreen}>
                <Text style={styles.tileScreen}>Login :</Text>
            </View>
            <Input
                id = 'email'
                label='Email'
                keyboardType='default'
                returnKeyType='next'
                errorText = 'Email is required'
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={false}
                required
                CommonWith= {{labelWith:'30%', inputWith:'70%'}}
                autoFocus = {true}
            />
            <Input
                id = 'password'
                label='Password'
                keyboardType='default'
                returnKeyType='next'
                errorText = 'Enter a valid Password'
                secureTextEntry={true}
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={false}
                required
                minLength={6}
                CommonWith= {{labelWith:'30%', inputWith:'70%'}}
            />
            {isLoading ? (<ActivityIndicator size="large" color="red" />)
            :(
                <ButtonSave paddingHorizontal={styles.button} onPress={submitHandler}>Login</ButtonSave>
            )
            }
        </ScrollView>
        )
}

const styles =StyleSheet.create({
    containerForm :{
        flex:1,
    },
    tileScreen :{
        fontSize:25,
        fontFamily:'lobster-regular'
    },
    containerTileScreen:{
        justifyContent:'center',
        alignContent:'center',
        marginHorizontal:'30%',
        marginBottom:30,
        marginTop: 20,
        borderBottomColor:'gray'
    },
    button: {
        paddingHorizontal: 20,
    },
})
export default LoginScreen