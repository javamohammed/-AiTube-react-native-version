import React,{useState, useEffect} from 'react';
import { fetchRandomVideosAction, readVideo, filtredVideos } from "../store/actions/videos";
import { StyleSheet, View, FlatList, StatusBar, Dimensions,ActivityIndicator, Keyboard, Alert } from 'react-native';
import { showMessage } from "react-native-flash-message";1
import VideoItem from '../components/videoItem';
import NavBar from '../components/NavBar';
import { useSelector, useDispatch } from "react-redux";
const HomeScreen = props => {
  const dispatch = useDispatch()
    const [numberColumn, setNumberColumn] = useState(Dimensions.get('window').width > 700 ? 3 : 1)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [nbItems, setNbItems] = useState(5)
    const randVideos = useSelector(state => state.videos.RandVideos)
    //const userInfo = useSelector(state => state.user)
    //console.log('props.route.params:::', props.route.params)
    const { navigation, route } = props
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
        if(success === 'login'){
          showMessage({
            message: "Successful Login!",
            type: "success",
          })
        }
        if(success === 'signup'){
          showMessage({
            message: "Successful Signup and Login!",
            type: "success",
          })
        }
      }
      route.params =  undefined
      
      dispatch(fetchRandomVideosAction('',nbItems))
     StatusBar.setHidden(true);
     const updateLayout = () => {
         setNumberColumn(Dimensions.get('window').width > 700 ? 3 : 1)
     }
      Dimensions.addEventListener('change', updateLayout)
      return () => {
          Dimensions.removeEventListener('change', updateLayout)
      }
  }, [navigation,route, dispatch, fetchRandomVideosAction, nbItems])
  const playVideo = (title, id) =>{
    dispatch(readVideo(id, title, 1))
  }
  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
     if (!loading) return null;
     return (
       <ActivityIndicator
         style={{ color: '#000' }}
       />
     );
   };
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
  props.navigation.navigate('Search',  { searchValue: searchValue })
  }
     return (
        <View style={styles.container}>
          <NavBar navigation={props.navigation}  search={true} onSearch={searchHandler} searchedText=""/>
          <View>
              <FlatList
              style={{ flex: 0 }}
              contentContainerStyle={{ paddingBottom: 130}}
              initialNumToRender={randVideos.length}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
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
    },
    body: {
      flex: 1,
      justifyContent:'space-between',
      alignItems:'center',
      width:'100%'
  }
})

export default HomeScreen