import React, { useEffect, useState } from 'react';
import {  StyleSheet,  View,   FlatList, StatusBar, Dimensions, Alert, Keyboard, Switch, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomVideosAction, deleteVideoAction, filtredVideos, readVideo} from "../store/actions/videos";
import { showMessage } from "react-native-flash-message";
import VideoItem from '../components/videoItem';
import NavBar from '../components/NavBar';
const MyVideosScreen = props =>{
    const dispatch = useDispatch()
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    const MyVideos = useSelector(state => state.videos.MyVideos)
     const userId = useSelector(state => state.user.userId)
     const token = useSelector(state => state.user.token)
     const [loading, setLoading] = useState(false)
     const [isYoutube, setIsYoutube] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
     const [nbItems, setNbItems] = useState(5)
     console.log('userId:::', userId)
     const { route } = props
    useEffect(()=>{
        const success = route?.params?.success  
      if(success){
        if(success === 'add' || success === 'update'){
          if( route?.params?.type === 'success'){
            if (success === 'add') {
              showMessage({
                message: "Video added with success",
                type: "success",
              })
            }
            if (success === 'update') {
              showMessage({
                message: "Video updated with success",
                type: "success",
              })
            }
          }else{
            showMessage({
              message: "Please Login again!!",
              type: "danger",
            })
          }
          
        }
      }
      route.params =  undefined
        dispatch(fetchRandomVideosAction(userId, nbItems))
       StatusBar.setHidden(true);
       const updateLayout = () => {
           setNumberColumn(Dimensions.get('window').width > 700 ? 3 : 1)
       }
        Dimensions.addEventListener('change', updateLayout)
        return () => {
            Dimensions.removeEventListener('change', updateLayout)
        }
    }, [dispatch, fetchRandomVideosAction, userId, nbItems, route])
    const playVideo = (title, id) =>{
        dispatch(readVideo(id, title, 1))
      }
    const handleLoadMore = async () =>{
        setLoading(true)
        await setNbItems(nbItems + 5)
        console.log('nbItems:::',nbItems)
        await dispatch(fetchRandomVideosAction('',nbItems))
        setLoading(false)
    
       }
    const deleteHandler = async (id) => {
        await dispatch(deleteVideoAction(id, userId, token))
    }
    const editHandler = (id, tag, title) => {
        //const jumpToAction = DrawerActions.jumpTo('New Video', { videoId: id, tag: tag, title:title });
        //props.navigation.dispatch(jumpToAction)
        
        props.navigation.navigate('Edit Video',  { videoId: id, tag: tag, title:title })
    }
    const searchHandler = async (searchValue) => {
        Keyboard.dismiss()
        console.log('isYoutube:::',isYoutube)
      if (searchValue.trim() === '') {
          Alert.alert("wrong input!", "Please Enter a valid value", [{
              text: "Oky"
          }]);
          return;
      }
    
      setLoading(true)
      await dispatch(filtredVideos(userId,searchValue, isYoutube))
      setLoading(false)
        props.navigation.navigate('SearchMyVideosScreen',  { searchValue: searchValue, isYoutube: isYoutube })
      }
    //console.log('width - ', width)
    //console.log('MyVideos =>', MyVideos)
    return (
      <View style={styles.container}>
        <NavBar youTube={true} search={true}  searchedText="" onSearch={searchHandler} navigation={props.navigation}>
        <Switch
              onValueChange = {()=>{
                setIsYoutube(state=> !state)
                //console.log(isYoutube)
              }}
              value = {isYoutube}
              />
              <Text style={{fontFamily:'lobster-regular', fontSize:15}}>Youtube</Text> 
        </NavBar>
        <View style={styles.body}>
            <FlatList
            contentContainerStyle={{ paddingBottom: 'auto'}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
                data={MyVideos}
                numColumns={numberColumn}
                key={numberColumn}
                renderItem={(video)=><VideoItem onDelete={()=>deleteHandler(video.item.id)}
                                                onEdit={()=>editHandler(video.item.id, video.item.tag, video.item.title)}
                                                admin={true}
                                                inYoutube={false}
                                                showVideo={()=>{playVideo(video.item.title,video.item.id_video)}}
                                                video={video.item}
                                                numberColumns={numberColumn} />}
                //keyExtractor={(item)=>item.id}
                keyExtractor = {(item, index) => `list-item-${index}`}
                ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
                  /*ListFooterComponent={()=>{
                   return <ActivityIndicator animating />
                  }}*/
                  /*refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                }*/
                onEndReachedThreshold={0.5}
                refreshing={loading}
                onRefresh={()=>{
                  handleLoadMore()
                }}
            />
        </View>
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
            flex: 1
        },
    body: {
        flex: 1,
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%'
    },
    tabBar: {
        backgroundColor: 'white',
        height: 60,
        borderTopWidth: 0.5,
        borderColor: '#E5E5E5',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabTitle: {
        fontSize: 11,
        color: '#3c3c3c',
        paddingTop: 4
    }
})
export default MyVideosScreen