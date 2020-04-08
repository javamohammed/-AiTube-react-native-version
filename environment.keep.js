const ENV = {
    dev: {
      apiUrl: "localhost",
      amplitudeApiKey: null
    },
    prod: {
      apiUrlAuthSignIn:
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=XXXXXXXXXXXXXXXXXXXXXXX",
      apiUrlAuthSignUp:
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=XXXXXXXXXXXXXXXXXXXXXXX",
      urlFireBase: "https://project-xxx.firebaseio.com",
      keyApiYoutube: "XXXXXXXXXXXXXXXXXXXXXXX",
      urlApiYoutube : "https://www.googleapis.com/youtube/v3",
      // Add other keys you want here
    }
  };
  
  export default ENV;