import React, { useEffect, useState } from 'react';
import {  StyleSheet,  View,   FlatList, Dimensions, Alert, Keyboard, Switch, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { checkIfAuth, deleteVideoAction, filtredVideos, readVideo, addVideo } from "../store/actions/videos";
import { showMessage } from "react-native-flash-message";
import VideoItem from '../components/videoItem';
import NavBar from '../components/NavBar';
const SearchMyVideosScreen = props =>{
    const dispatch = useDispatch()
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    let MyVideos = useSelector(state => state.videos.MyVideos)
    const userId = useSelector(state => state.user.userId)
    const token = useSelector(state => state.user.token)
    const firstName = useSelector(state => state.user.firstName)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [isYoutube, setIsYoutube] = useState(props.route.params.isYoutube)
    const [searchValue, setSearchValue] = useState(props.route.params.searchValue)
    const [nbItems, setNbItems] = useState(5)
    const playVideo = (title, id) =>{
    dispatch(readVideo(id, title, 1))
    }
    const handleLoadMore = async () =>{
        setLoading(true)
        await setNbItems(nbItems + 5)
        /*
        console.log('nbItems:::',nbItems)
        await dispatch(fetchRandomVideosAction('',nbItems))*/
        let nextPageToken = MyVideos[0].nextPage
        if(nextPageToken){
            await dispatch(filtredVideos(userId,searchValue, isYoutube,nextPageToken))
        }
        setLoading(false)
    
       }
    const deleteHandler = async (id) => {
        await dispatch(deleteVideoAction(id, userId, token))
    }
    const editHandler = (id, tag, title) => {
        props.navigation.navigate('Edit Video',  { videoId: id, tag: tag, title:title })
    }
    const searchHandler = async (searchValue) => {
      Keyboard.dismiss()
      if (searchValue.trim() === '') {
        Alert.alert("wrong input!", "Please Enter a valid value", [{
            text: "Oky"
        }]);
        return;
    }
    setLoading(true)
    await dispatch(filtredVideos(userId,searchValue, isYoutube))
    setLoading(false)
  
    }
    const saveFromYoutube = async (videoId)=> {
        const result =  await dispatch(addVideo(videoId, "", userId, token, firstName))
            //const result =  await dispatch(addVideo("wWYnR3ofhGQ", formState.inputsValues.tag, user.userId, user.token, user.firstName))
            if(result === 'error'){
                Alert.alert("Error!", "This Video not found", [{
                    text: "Oky"
                }]);
                return;
            }
            if(result === 'exist'){
                Alert.alert("Warning!", "This Video Already added!", [{
                    text: "Oky"
                }]);
                return;
            }
            const checkIfAuthVar = await checkIfAuth()
            let type = "success"
            if(checkIfAuthVar === 0){
            type = "error"
            }
            if(type === 'success' ){
                showMessage({
                    message: "Video added with success",
                    type: "success",
                  })
            }else{
                showMessage({
                    message: "Please Login again!!",
                    type: "danger",
                  })
            }
    }
    //console.log('width - ', width)
    //console.log('MyVideos =>', MyVideos)
    return (
      <View style={styles.container}>
        <NavBar navigation={props.navigation} youTube={true} search={true} onSearch={searchHandler} back={true} backToMy={true} searchedText={props.route.params.searchValue}>
        <Switch
              onValueChange = {()=>{
                setIsYoutube(state=> !state)
                //console.log(isYoutube)
              }}
              value = {props.route.params.isYoutube}
              />
              <Text style={{fontFamily:'lobster-regular', fontSize:15}}>Youtube</Text> 
        </NavBar>
        <View style={styles.body}>
            <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
                data={MyVideos}
                numColumns={numberColumn}
                key={numberColumn}
                renderItem={(video)=><VideoItem onDelete={()=>deleteHandler(video.item.id)}
                                                onEdit={()=>editHandler(video.item.id, video.item.tag, video.item.title)}
                                                admin={true}
                                                showVideo={()=>{playVideo(video.item.title,video.item.id_video)}}
                                                video={video.item}
                                                inYoutube={props.route.params.isYoutube}
                                                icon={"save"}
                                                onSave={()=>saveFromYoutube(video.item.id_video)}
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
export default SearchMyVideosScreen