import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import thumbnailsTypes from '../Utils/thumbnailsTypes'
import Thumbnails from '../Utils/thumbnails'
function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol + ' views';
}
const VideoItem = props =>{
    let video = props.video;
    let withContainer = Dimensions.get('window').width
    let heightImage = 200
    if(props.numberColumns === 3 ){
        withContainer = Dimensions.get('window').width / 3
        heightImage = 130
    }
    return(
         <View style={{...styles.container,width:withContainer}}>
            <TouchableOpacity onPress = {props.showVideo} >
                <View style={styles.imageContainer}>
                 <Image source={{ uri: Thumbnails.getThumbnail(video.id_video, thumbnailsTypes.medium).url  }} style={{ height: heightImage, width: '100%' }} />
            </View>
             {!props.admin && <View style={styles.descContainer}>
                 {/*<Image source={{ uri: 'https://randomuser.me/api/portraits/men/0.jpg' }} style={{ width: 50, height: 50, borderRadius: 25 }} />*/}
                 <View style={styles.videoDetails}>
                        <Text numberOfLines={2} style={styles.videoTitle}>{video.title}</Text>
                        {/*<Text style={styles.videoStats}>{video.user_id}</Text>*/}
                    </View>
             </View>}
             </TouchableOpacity>
            {props.admin &&
                <View style={styles.descContainerAdmin}>
                    <View style={styles.videoDetails}>
                        <Text numberOfLines={2} style={styles.videoTitle}>{video.title}</Text>
                    </View>
                    <View style={styles.containerBtn}>
                    {props.inYoutube === true &&
                     <TouchableOpacity style={styles.btn} onPressIn={()=>{
                        props.onSave()
                       // setIcon('check')
                     }}>
                        <Icon title={props.icon} name={props.icon} size={25} color="green"/>
                    </TouchableOpacity>}
                    {props.inYoutube === false && <>
                        <TouchableOpacity style={styles.btn} onPressIn={props.onEdit}>
                            <Icon title="edit" name="edit" size={25} color="green"/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}  onPress={props.onDelete}>
                            <MaterialIcons title="delete" name="delete" size={25} color="red"/>
                        </TouchableOpacity></>}
                    </View>
                </View>

            }
         </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    descContainer: {
        flexDirection: 'row',
        paddingTop: 15,
    },
    descContainerAdmin: {
        flexDirection: "column",
        paddingTop: 15,
        borderBottomRightRadius: 3,
        borderBottomLeftRadius:3,
        borderLeftWidth:0.5,
        borderBottomWidth: 0.5,
        borderRightWidth: 0.5,
    },
    containerBtn:{
        flexDirection: 'row',
        paddingTop: 15
    },
    btn :{
        marginHorizontal:'20%'
    },
    imageContainer:{
        justifyContent:'center',
        alignItems:'center'
    },
    videoTitle: {
        fontSize: 20,
        color: '#3c3c3c',
        fontFamily:'lobster-regular'

    },
    videoDetails: {
        paddingHorizontal: 15,
        flex: 1
    },
    videoStats: {
        fontSize: 15,
        paddingTop: 3
    }

});
export default VideoItem