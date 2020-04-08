import React, { useEffect, useState } from 'react';
import { StyleSheet , View, Image, TouchableOpacity, StatusBar, Dimensions, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const NavBar = props =>{
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    const tmpSearchedVal = props.searchedText ? props.searchedText :""
    const [searchValue, setSearchValue] = useState(tmpSearchedVal)
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
            {props.back && <TouchableOpacity onPress={() => {
            if(props.navigation){
              setSearchValue("")
              let to = 'Home'
              if (props.backToMy) {
                to ='My Videos'
              }
              props.navigation.navigate(to,{refresh:"refresh"})  
            }
          }}>
              <Entypo
                style={styles.navItemMenu}
                title="back"
                name="back"
                size={25}
              />
            </TouchableOpacity>}
          {!props.back && <TouchableOpacity onPress={() => {
            if(props.navigation){
              props.navigation.openDrawer()
            }
          }}>
              <Entypo
                style={styles.navItemMenu}
                title="menu"
                name="menu"
                size={25}
              />
            </TouchableOpacity> }
            {props.search && <><TouchableOpacity onPress={()=>{
               props.onSearch(searchValue)
            }}>
              <Ionicons
                style={styles.navItem}
                title="Search"
                name="search"
                size={25}
              />
            </TouchableOpacity>
            <TextInput clearButtonMode='always' onChangeText={(text)=>setSearchValue(text)}  value={searchValue} style={styles.styleSearchInput}/>
            </>
            }
            {props.youTube && props.children}
            
          </View>
          <View style={styles.leftNav}>
          <Image
            source={require("../assets/aictube.png")}
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
      flex:1,
      alignItems:'center',
      flexDirection: 'row',
    },
    leftNav: {
      marginRight:-20
    },
    styleSearchInput:{
      width:'40%',
      height:25,
      padding:1,
      marginLeft:5,
      borderWidth:1,
      borderRadius:4
    },
    navItem: {
        marginLeft: 25
    },
    navItemMenu:{
        marginLeft: 0
    }
})
export default NavBar