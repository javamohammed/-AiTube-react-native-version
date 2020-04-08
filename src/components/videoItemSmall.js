import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import thumbnailsTypes from '../Utils/thumbnailsTypes'
import Thumbnails from '../Utils/thumbnails'
const VideoItemSmall = props =>{
    let video = props.video;
    return(
            <TouchableOpacity onPress={props.showVideo}>
         <View style={styles.container}>
                <View style={styles.imageContainer}>
                 <Image source={{ uri: Thumbnails.getThumbnail(video.id_video, thumbnailsTypes.default).url  }} style={{ height: '100%', width: '100%' }} />
            </View>
             <View style={styles.descContainer}>
                 <View style={styles.videoDetails}>
                        <Text numberOfLines={3} style={styles.videoTitle}>{video.title}</Text>
                    </View>
                    <View style={styles.profileContainer}>
                            {/*<Image source={{ uri: 'https://randomuser.me/api/portraits/men/0.jpg' }} style={{ width: 20, height: 20, borderRadius: 10 }} />*/}
                            {/*<Text>{video.user_id}</Text>*/}
                    </View>
             </View>
         </View>
            </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        width: Dimensions.get('window').width,
        padding: 15,
    },
    descContainer: {
        flexDirection: 'column',
        width: (Dimensions.get('window').width -  Dimensions.get('window').width / 3),
        paddingTop: 15
    },
    imageContainer:{
        width: Dimensions.get('window').width/3,
        height:100
    },
    videoTitle: {
        fontSize: 15,
        color: '#3c3c3c',
        textAlign: 'center',
    },
    videoDetails: {
        marginRight:5,
        paddingHorizontal: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileContainer: {
        fontSize: 15,
        paddingTop: 3,
        marginLeft:10,
        justifyContent:'center',
        alignItems:'flex-start'
    }

});
export default VideoItemSmall