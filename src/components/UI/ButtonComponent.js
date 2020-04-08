import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

const ButtonComponent = props => {
  let ButtonComponent = TouchableOpacity;

  if (Platform.Version >= 21) {
    ButtonComponent = TouchableNativeFeedback;
  }

  return (
      <View style={styles.inputsForm}>
          <View style={styles.buttonStyle}>
               <View style={styles.buttonContainer}>
                    <ButtonComponent activeOpacity={0.6} onPress={props.onPress}>
                        <View style={{...styles.button, ...props.paddingHorizontal}}>
                        <Text style={styles.buttonText}>{props.children}</Text>
                        </View>
                    </ButtonComponent>
                </View>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden'
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 25
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily:'lobster-regular'
  },
   inputsForm :{
        flexDirection:'row',
        marginHorizontal:'10%',
        marginVertical:20,
    },
    buttonStyle:{
        marginHorizontal:'30%'
    }
});

export default ButtonComponent;