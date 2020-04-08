import React,{useState, useEffect} from 'react';
import { readVideo, filtredVideos } from "../store/actions/videos";
import { StyleSheet, View, FlatList, StatusBar, Dimensions, Keyboard, Alert } from 'react-native';
import VideoItem from '../components/videoItem';
import NavBar from '../components/NavBar';
import { useSelector, useDispatch } from "react-redux";
const SearchScreen = props => {
  const dispatch = useDispatch()
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [nbItems, setNbItems] = useState(5)
    const randVideos = useSelector(state => state.videos.RandVideos)
    //const userInfo = useSelector(state => state.user)
    //console.log('props.route.params:::', props.route.params)
    const { navigation, route } = props
    /*
    useEffect(()=>{
      console.log('kkkk:::',route.params.searchValue)
    //  dispatch(filtredVideos('',nbItems, route.params.searchValue))
     StatusBar.setHidden(true);
     const updateLayout = () => {
         setNumberColumn(Dimensions.get('window').width > 700 ? 3 : 1)
     }
      Dimensions.addEventListener('change', updateLayout)
      return () => {
          Dimensions.removeEventListener('change', updateLayout)
      }
  }, [navigation,route, dispatch, filtredVideos, nbItems])*/
  const playVideo = (title, id) =>{
    dispatch(readVideo(id, title, 1))
  }
   const onRefresh = () => {
     setRefreshing(true)
     setTimeout(() => {
       console.log('eeeeee')
     }, 1000);
     setRefreshing(false)

   }
   const handleLoadMore = async () =>{
    setLoading(true)
    await setNbItems(nbItems + 5)
    console.log('nbItems:::',nbItems)
    await dispatch(fetchRandomVideosAction('',nbItems))
    setLoading(false)

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
  await dispatch(filtredVideos('',searchValue))
  setLoading(false)

  }
  console.log("searchValue:::",props.route.params.searchValue)
     return (
        <View style={styles.container}>
          <NavBar navigation={props.navigation} onSearch={searchHandler} back={true} search={true} searchedText={props.route.params.searchValue}/>
          <View style={styles.body}>
              <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={true}
                  data={randVideos}
                  numColumns={numberColumn}
                  key={numberColumn}
                  renderItem={(video)=><VideoItem showVideo={()=>{playVideo(video.item.title,video.item.id_video)}} video={video.item} numberColumns={numberColumn} />}
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
                /*
                onEndReached={()=>{
                  handleLoadMore()
                }}*/
              />
          </View>
        </View>
      );
}
const styles = StyleSheet.create({
    contanier:{
        flex:1
    }
})

export default SearchScreen