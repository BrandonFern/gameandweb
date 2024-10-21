const firebaseConfig = {
    apiKey: "AIzaSyALAhnbjODzUtK_sXiU_SDItVn5jkdpMAo",
    authDomain: "gameandweb-74921.firebaseapp.com",
    projectId: "gameandweb-74921",
    storageBucket: "gameandweb-74921.appspot.com",
    messagingSenderId: "293549056941",
    appId: "1:293549056941:web:2af73898c94c98bf89f724",
    measurementId: "G-CLQQLM3J74"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;
      const isGoogleSignIn = user.providerData.some(
        (provider) => provider.providerId === 'google.com'
      );
      const userRef = db.collection("Players").doc(userId);
  
      userRef.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          console.log("User data:", userData);
  
          const displayName = isGoogleSignIn ? user.displayName : user.email;
          document.getElementById('user-name').innerText = `${displayName} (Level ${userData.level})`;
  
          populateAchievements(userData.achievement);
          populateStats(userData.stats);
          populateLoot(userData.equipment);
        }
      }).catch((error) => {
        console.log("Error getting user document:", error);
      });
  
    } else {
      window.location.href = "index.html";
    }
  });
  
  function populateAchievements(achievements) {
    const achievementTable = document.getElementById('achievement-table');
    for (let achievement in achievements) {
      let newRow = achievementTable.insertRow();
      let achievementCell = newRow.insertCell(0);
      let statusCell = newRow.insertCell(1);
      achievementCell.innerText = achievement;
      statusCell.innerText = achievements[achievement] ? "Completed" : "Not Completed";
    }
  }
  
  function populateStats(stats) {
    const statsTable = document.getElementById('stats-table');
    for (let stat in stats) {
      let newRow = statsTable.insertRow();
      let statCell = newRow.insertCell(0);
      let statusCell = newRow.insertCell(1);
      statCell.innerText = stat;
      statusCell.innerText = stats[stat];
    }
  }
  
  function populateLoot(equipment) {
    const lootTable = document.getElementById('loot-table');
    equipment.forEach(item => {
      let newRow = lootTable.insertRow();
      let lootCell = newRow.insertCell(0);
      lootCell.innerText = item;
    });
  }
  
  document.getElementById('logout-btn').addEventListener('click', function() {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    }).catch((error) => {
      console.log("Error during logout: ", error);
    });
  });
  