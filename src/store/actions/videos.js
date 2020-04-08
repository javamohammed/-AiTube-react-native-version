import Video from "../../Models/Video";
import Env from "../../environment";
import AsyncStorage  from '@react-native-community/async-storage';
const urlFireBase = Env.prod.urlFireBase;
const keyApiYoutube = Env.prod.keyApiYoutube
const urlApiYoutube = Env.prod.urlApiYoutube;

export const NEED_AUTH = "NEED_AUTH";
export const FETCH_RANDOM_VIDEO = "FETCH_RANDOM_VIDEO";
export const FETCH_MY_VIDEO = "FETCH_MY_VIDEO";
export const UPDATE_VIDEO = "UPDATE_VIDEO";
export const DELETE_VIDEO = "DELETE_VIDEO";
export const ADD_VIDEO = "ADD_VIDEO";
export const CURRENT_VIDEO = "CURRENT_VIDEO";
//export const FILTRED_VIDEOS = "FILTRED_VIDEOS";


export const readVideo = (id, title, active) => {
  if(active === 1){
    return {
      type: CURRENT_VIDEO,
      video:{
        id: id,
        title: title
      }
    }
  }else{
    return {
      type: CURRENT_VIDEO,
      video:null
    }
  }
  
}
export const checkIfAuth =  async () => {
  const userData = await AsyncStorage.getItem('userDataAiTube')
  let checkAuth = 0
  if(userData != null){
    const transformedData = JSON.parse(userData)
    const {expirationDate, token, userId, email } = transformedData
    if((new Date(expirationDate).getTime()) > (new Date()).getTime() && token && userId){
      checkAuth = 1
    }
  }
    return checkAuth
}

export const filtredVideos = (user_id,searchedValue, isYoutube=false, nextPageToken=null) => {
  
  return async dispatch => {
    console.log('REdux isYoutube:::', isYoutube)
    const flitredVideos = []
    if (isYoutube === true) {
      let linkSearch = `${urlApiYoutube}/search?part=snippet&q=${searchedValue}&type=video&key=${keyApiYoutube}`
      if(nextPageToken !== null){
        linkSearch = `${urlApiYoutube}/search?part=snippet&q=${searchedValue}&type=video&key=${keyApiYoutube}&pageToken=${nextPageToken}`
      }
      const videos = await fetch(linkSearch);
      const response = await videos.json(); 
      if (response.items.length === 0) {
        // throw Error('This Video not found!');
        return "error";
      }
      const items = response.items;
      //console.log('items:::',items)
      for (const item in items) {
          //console.log('snippet::::',response.nextPageToken)
          //id, link, id_video, title, description, published_at, user_id, tag, nextPage
          flitredVideos.push(
            new Video(
              "",
              "",
              items[item].id.videoId,
              items[item].snippet.title,
              items[item].snippet.description,
              items[item].snippet.publishedAt,
              "",
              "",
              response.nextPageToken
            )
          );
      }
      dispatch({
        type: FETCH_MY_VIDEO,
        MyVideos: flitredVideos
      });
      return
    } 
    
    try {
      const videos = await fetch(`${urlFireBase}/videos.json?orderBy="id_video"`);
      const resData = await videos.json();
      const flitredVideos = []
      //console.log(resData)
      for (const key in resData) {
        if(resData[key].title.toLowerCase().includes(searchedValue.toLowerCase())){
            flitredVideos.push(
                new Video(
                  key,
                  resData[key].link,
                  resData[key].id_video,
                  resData[key].title,
                  resData[key].description,
                  resData[key].published_at,
                  resData[key].userId,
                  resData[key].tag
                )
              );
        }
        
      }
      if (user_id === "") {
        dispatch({
          type: FETCH_RANDOM_VIDEO,
          RandVideos: flitredVideos
        });
        return;
      } else {
        dispatch({
          type: FETCH_MY_VIDEO,
          MyVideos: flitredVideos.filter(video => video.user_id === user_id)
        });
        return;
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}
export const fetchRandomVideosAction = (user_id, nbItems=10) => {
  return async dispatch => {
    try {
      //const videos = await fetch(`${urlFireBase}/videos.json`);
      const videos = await fetch(`${urlFireBase}/videos.json?orderBy="id_video"&limitToFirst=${nbItems}`);
      const resData = await videos.json();
      const loadedVideos = [];
      for (const key in resData) {
        loadedVideos.push(
          new Video(
            key,
            resData[key].link,
            resData[key].id_video,
            resData[key].title,
            resData[key].description,
            resData[key].published_at,
            resData[key].userId,
            resData[key].tag
          )
        );
      }
      if (user_id === "") {
        dispatch({
          type: FETCH_RANDOM_VIDEO,
          RandVideos: loadedVideos
        });
        return;
      } else {
        //console.log('loadedVideos:::',loadedVideos)
        dispatch({
          type: FETCH_MY_VIDEO,
          MyVideos: loadedVideos.filter(video => video.user_id === user_id)
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const addVideo = (Id_video, tag, userId, token, first_name) => {
  return async dispatch => {
    const checkIfAuthVar = await checkIfAuth()
    if (checkIfAuthVar === 0) {
      dispatch({
        type: NEED_AUTH
      })
      return;
    }
       /*
try {

    /*
  //const videos = await fetch(`${urlFireBase}/videos.json?orderBy="id_video"&equalTo="UkQWkE7c0Yc"`);
  const videos = await fetch(`${urlFireBase}/videos.json?orderBy="id_video"&limitToFirst=20`);
  const resData = await videos.json();
   const loadedVideos = [];
   for (const key in resData) {
     loadedVideos.push(new Video(key, resData[key].id_video));
   }
   console.log(loadedVideos);
 
  const loadedVideos = [];
  for (const key in resData) {
    loadedVideos.push(
      new Video(
        key,
        resData[key].link,
        resData[key].id_video,
        resData[key].title,
        resData[key].description,
        resData[key].published_at,
        resData[key].userId
      )
    );
  }
  if (user_id === "") {
    dispatch({
      type: FETCH_RANDOM_VIDEO,
      RandVideos: loadedVideos
    });
  } else {
    dispatch({
      type: FETCH_MY_VIDEO,
      MyVideos: loadedVideos.filter(video => video.user_id === user_id)
    });
  }
} catch (error) {
  throw error;
}*/
    //Id_video = "aNNUdNhpSB8";
    const videoExist = await fetch(`${urlFireBase}/videos.json?orderBy="id_video"&equalTo="${Id_video}"`);
    const resDataVideoExist = await videoExist.json();
    var result = [];
    for (const key in resDataVideoExist) {
      result.push(resDataVideoExist[key].userId);
    }
    if(result.length !== 0 ){
      if(result.includes(userId))
          return 'exist'
      else
          return 'error' 
    }

    const videos = await fetch(`${urlApiYoutube}/videos?part=snippet&id=${Id_video}&key=${keyApiYoutube}`);
    const response = await videos.json(); 
    if (response.items.length === 0) {
       // throw Error('This Video not found!');
      return "error";
    }
   const item = response.items[0].snippet;
         const resultVideo = await fetch(`${urlFireBase}/videos.json?auth=${token}`, {
           method: "POST",
           headers: {
             "Content-Type": "application/json"
           },
           body: JSON.stringify({
             id_video: Id_video,
             title: item.title,
             tag: tag,
             published_at: new Date().toString(),
             userId: userId,
             first_name: first_name
           })
         });
         const resData = await resultVideo.json()
        // console.log(resData)
         dispatch({
             type: ADD_VIDEO,
             videoData: {
                 id: resData.name,
                 tag,
                 title: item.title,
                 tag,
                 published_at: new Date().toString(),
                 user_id: first_name
             }
         })
  };
};

export const deleteVideoAction = (id, user_id, token) => {
  return async dispatch => {
    //await deleteVideo(id, user_id)
    const checkIfAuthVar = await checkIfAuth()
    if (checkIfAuthVar === 0) {
      dispatch({
        type: NEED_AUTH
      })
      return;
    }
    await fetch(`${urlFireBase}/videos/${id}.json?auth=${token}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    dispatch(fetchRandomVideosAction(user_id));
    dispatch({
      type: DELETE_VIDEO
    });
  };
};

export const updateVideoAction = ( Id_video, tag, userId, token ) => {
  return async dispatch => {
    //await updateVideo(id_video, title, user_id)
    const checkIfAuthVar = await checkIfAuth()
    if (checkIfAuthVar === 0) {
      dispatch({
        type: NEED_AUTH
      })
      return;
    }
       try {
         await fetch(`${urlFireBase}/videos/${Id_video}.json?auth=${token}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              tag: tag,
          })
      })
          dispatch(fetchRandomVideosAction(userId))
      dispatch({
        type: UPDATE_VIDEO
      });
       } catch (error) {
          return "Network_error" 
       }
  };
};