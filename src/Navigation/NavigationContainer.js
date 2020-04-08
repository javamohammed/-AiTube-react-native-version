import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import SearchMyVideosScreen from "../screens/SearchMyVideosScreen";
import MyVideosScreen from "../screens/MyVideosScreen";
import AddVideoScreen from "../screens/AddVideoScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import StartUpScreen from "../screens/StartUpScreen";
import LogoutScreen from "../screens/LogoutScreen";
import PlayerVideoScreen from "../screens/PlayerVideoScreen";
import MyHeader from "../components/UI/MyHeader";
import * as React from 'react';
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Videos" component={MyVideosScreen} options={{ headerShown:false }} />
      <Stack.Screen name="SearchMyVideosScreen" component={SearchMyVideosScreen} options={{  headerShown:false }} />
      <Stack.Screen name="Edit Video" component={AddVideoScreen} options={{ title:"Edit Video" }} />
    </Stack.Navigator>
  );
}
function MyStackHome() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown:false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{  headerShown:false }} />
    </Stack.Navigator>
  );
}
function Home() {
  //route.params.title
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomeScreen} options={{ headerShown:false }} />
      <Stack.Screen name="Play" component={PlayerVideoScreen} options={{header: ({ scene, previous, navigation }) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.params.title;

  return (
    <MyHeader
      title={title}
      leftButton={()=>{navigation.goBack()}}
    />
  );
}}}  />
    </Stack.Navigator>
  );
}
/*
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Close drawer"
        onPress={() => props.navigation.closeDrawer()}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}*/

const Drawer = createDrawerNavigator();

function MyDrawer(props) {
  /*console.log("token:::",props.user.token)
  if(props.user.token === null){
    console.log("token null")
  }else{
    console.log('token is not null')
  }*/
  return (
    <Drawer.Navigator /*drawerContent={props => CustomDrawerContent(props)}*/ drawerStyle={{backgroundColor: '#c6cbef'}}>
      {props.user.start === 0 &&<Drawer.Screen name="start" component={StartUpScreen} options={{unmountOnBlur: true, drawerLabel: () => null}} />}
      <Drawer.Screen name="Home" component={MyStackHome} options={{drawerLabel : ()=><Text style={styles.labelStyle}>Home</Text>}} />
      {props.user.token !== null &&<Drawer.Screen name="My Videos"  component={MyStack} options={{drawerLabel : ()=><Text style={styles.labelStyle}>My Videos</Text>}}/>}
      {props.user.token !== null &&<Drawer.Screen name="New Video" component={AddVideoScreen} options={{unmountOnBlur: true,drawerLabel : ()=><Text style={styles.labelStyle}>New Video</Text>}}  />}
      {props.user.token === null && <Drawer.Screen name="Login" component={LoginScreen} options={{drawerLabel : ()=><Text style={styles.labelStyle}>Login</Text>}} />}
      {props.user.token === null &&<Drawer.Screen name="Register" component={RegisterScreen} options={{drawerLabel : ()=><Text style={styles.labelStyle}>Register</Text>}} />}
      {props.user.token !== null &&<Drawer.Screen name="Logout"  component={LogoutScreen} options={{unmountOnBlur: true,drawerLabel : ()=><Text style={styles.labelStyle}>Logout</Text>}} />}
    </Drawer.Navigator>
  );
}

const styles = {
  labelStyle :{
    fontSize:20,
    fontFamily:'lobster-regular'
  }
}
export default function App() {
  const userInfo = useSelector(state => state.user)
  const video = useSelector(state => state.videos.currentVideo)
  if(video != null){
    return <PlayerVideoScreen title={video.title} id={video.id}/>
  }
  //console.log('token:::', userInfo.token)
  return (
    <NavigationContainer>
      <MyDrawer user={userInfo} />
    </NavigationContainer>
  );
}
