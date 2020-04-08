import React, { useEffect, useState } from 'react';
import { StyleSheet , View, Image, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const MyHeader = props =>{
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    useEffect(()=>{
       StatusBar.setHidden(true);
       const updateLayout = () => {
           setNumberColumn(Dimensions.get('window').width > 700 ? 3 : 1)
       }
        Dimensions.addEventListener('change', updateLayout)
        return () => {
            Dimensions.removeEventListener('change', updateLayout)
        }
    }, [])
    //console.log('width - ', width)
    return (
        <View style={styles.navBar}>
          {/*<Image
            source={require("../assets/aictube.png")}
            style={{ width: 98, height: 22 }}
          />*/}
          <View style={styles.rightNav}>
          <TouchableOpacity onPress={props.leftButton}>
              <Entypo
                style={styles.navItemMenu}
                title="back"
                name="back"
                size={25}
              />
            </TouchableOpacity>
                <Text style={styles.title}>{props.title}</Text>
          </View>
          <View style={styles.leftNav}>
          <Image
            source={require("../../assets/aictube.png")}
            style={{ width: 98, height: 22, marginRight:0 }}
          />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        height: 55,
        backgroundColor: 'white',
        elevation: 3,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rightNav: {
        flexDirection: 'row'
    },
    leftNav: {
        marginRight:-20
      },
    navItem: {
        marginLeft: 25
    },
    navItemMenu:{
        marginLeft: 0
    },
    title:{
        marginLeft: '5%',
        marginRight:"5%",
        fontSize:17,
        fontFamily:'lobster-regular'
    }
})
export default MyHeader