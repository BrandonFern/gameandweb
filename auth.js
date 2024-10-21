const firebaseConfig = {
    apiKey: "AIzaSyALAhnbjODzUtK_sXiU_SDItVn5jkdpMAo",
    authDomain: "gameandweb-74921.firebaseapp.com",
    projectId: "gameandweb-74921",
    storageBucket: "gameandweb-74921.appspot.com",
    messagingSenderId: "293549056941",
    appId: "1:293549056941:web:2af73898c94c98bf89f724",
    measurementId: "G-CLQQLM3J74"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.getElementById('register-btn').addEventListener('click', function() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Registration successful! Welcome, " + user.email);
        window.location.href = "user.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during registration: ", errorCode, errorMessage);
        alert("Error: " + errorMessage);
      });
  });
  
  document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Login successful! Welcome back, " + user.email);
        window.location.href = "user.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during login: ", errorCode, errorMessage);
        alert("Error: " + errorMessage);
      });
  });
  