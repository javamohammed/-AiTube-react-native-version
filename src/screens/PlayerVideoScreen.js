import React, { useEffect, useState } from 'react';
import Env from "../environment";
import { Platform, StyleSheet, Text, View, FlatList, StatusBar, Dimensions } from 'react-native';
import VideoItemSmall from '../components/videoItemSmall';
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomVideosAction, readVideo } from '../store/actions/videos';
import MyHeader from "../components/UI/MyHeader";
import YouTube from 'react-native-youtube';

const PlayerVideoScreen = props =>{
    const dispatch = useDispatch()
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    const [heightPlayer, setHeightPlayer] = useState(Dimensions.get('window').width > 700 ? 500 : 300)
    const randVideos = useSelector(state => state.videos.RandVideos)
    console.log('numberColumn:::',numberColumn)
    useEffect(()=>{
      if(randVideos.length  === 0){
        dispatch(fetchRandomVideosAction(''))
      }
       
       StatusBar.setHidden(true);
       const updateLayout = () => {
           setNumberColumn(Dimensions.get('window').width > 700 ? 3 : 1)
       }
        Dimensions.addEventListener('change', updateLayout)
        return () => {
            Dimensions.removeEventListener('change', updateLayout)
        }
    }, [dispatch, fetchRandomVideosAction,props, randVideos])
    const playVideo = (title, id) => {
      dispatch(readVideo(id,title,1))
    }
    //console.log('width - ', width)
    const videoId = props.route?.params?.videoId //props.navigation.getParam('videoId')
    return (
      <View style={{ paddingTop: 1 }}>
        <MyHeader
          title={props.title}
          leftButton={()=>{dispatch(readVideo('','',0))}}
        />
       <YouTube
            videoId={props.id} // The YouTube video ID
            play // control playback of video with true/false
            //fullscreen // control whether the video should play in fullscreen or inline
            loop // control whether the video should loop when ended
            style={{ alignSelf: 'stretch', height: heightPlayer }}
            apiKey={Env.prod.keyApiYoutube}
            />
        <View>
        <Text style={styles.titleVideo}>{props.title}</Text>
        <View style={styles.profileContainer}>
                  {/*<Image source={{ uri: 'https://randomuser.me/api/portraits/men/0.jpg' }} style={{ width: 50, height: 50, borderRadius: 25 }} />*/}
                  {/*<Text>Aicha</Text>*/}
          </View>
         <FlatList
            style={{ flex: 0 }}
            contentContainerStyle={{ paddingBottom: 130}}
            initialNumToRender={randVideos.length}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
                data={randVideos}
                numColumns={numberColumn}
                key={numberColumn}
                renderItem={(video)=><VideoItemSmall showVideo={()=>{playVideo(video.item.title,video.item.id_video)}} video={video.item} numberColumns={numberColumn} />}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={()=><View style={{height:0.5,backgroundColor:'#E5E5E5'}}/>}
            />
        </View>
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
          flex: 1,
          borderBottomWidth:1
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
    },
    titleVideo:{
      fontSize:20,
      textAlign:'center',
      paddingVertical:10,
      paddingHorizontal:10,
      fontFamily:'lobster-regular'
    },
    profileContainer: {
      fontSize: 15,
      paddingTop: 3,
      marginLeft: 10,
      justifyContent: 'center',
      alignItems: 'flex-start'
    }
})
export default PlayerVideoScreen