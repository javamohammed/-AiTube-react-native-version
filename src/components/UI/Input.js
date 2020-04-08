import React, { useReducer, useEffect } from "react";
import { View, TextInput ,Text, StyleSheet } from 'react-native';
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false
  });
  const { onInputChange, id } = props;
  useEffect(() => {
    if (inputState.touched || inputState.isValid) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);
  const textChangeHandler = async text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const PhoneRegex = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.id === "phone" && !PhoneRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.id === "confirm_password" && text !== props.confirm_password) {
      isValid = false;
    }
    await dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };
  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };
  /**
   <View style={styles.inputsForm}>
                <Text style={styles.textStyle}>{props.children}</Text>
                <TextInput style={styles.inputTextStyle}/>
        </View>
   */
  return (
        <View style={styles.formControl}>
            <Text style={{...styles.label}}>{props.label}</Text>
            <View style={styles.InputContainer}>
              <TextInput style={{...styles.input, width:props.CommonWith.inputWith}}
                {...props}
                value={inputState.value}
                onChangeText={textChangeHandler}
                onBlur={lostFocusHandler}
                />
                {!inputState.isValid && inputState.touched && <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText}</Text></View>
                }
                </View>
        </View>);
};
const styles = StyleSheet.create({
    formControl: {
      flexDirection: 'row',
      marginHorizontal: '10%',
      marginVertical: 20,
    },
    label: {
      marginHorizontal: 10,
      fontFamily:'lobster-regular',
      fontSize: 20,
  },
    input: {
      borderBottomWidth: 1,
    },
    InputContainer:{
      width:'100%'
    },
    errorContainer: {
      marginVertical: 5
    },
    errorText: {
      fontSize: 13,
      color: 'red',
      fontFamily:'lobster-regular'
    },
    errorBorder:{

    }

})
export default Input;