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
        } else {
          const newUserName = isGoogleSignIn ? user.displayName : user.email;
          userRef.set({
            name: newUserName,
            email: user.email,
            stats: {
              kills: 0,
              deaths: 0,
              lootamount: 0,
            },
            level: 1,
            equipment: [],
            achievement: {
              "Kill 5 enemies": false,
              "Kill 10 enemies": false,
              "Kill 25 enemies": false,
              "Collect 5 items": false,
              "Collect 10 items": false,
              "Collect 25 items": false,
              "Walk": false,
              "Melee": false,
              "Jump": false,
              "Sprint": false,
            },
          }).then(() => {
            console.log("New user document created!");
            document.getElementById('user-name').innerText = `${newUserName} (Level 1)`;
            populateAchievements({
              "Kill 5 enemies": false,
              "Kill 10 enemies": false,
              "Kill 25 enemies": false,
              "Collect 5 items": false,
              "Collect 10 items": false,
              "Collect 25 items": false,
              "Walk": false,
              "Melee": false,
              "Jump": false,
              "Sprint": false,
            });
            populateStats({
              kills: 0,
              deaths: 0,
              lootamount: 0,
            });
          }).catch((error) => {
            console.error("Error creating user document:", error);
          });
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
    let kills = stats.kills || 0;
    let deaths = stats.deaths || 0;

    for (let stat in stats) {
      let newRow = statsTable.insertRow();
      let statCell = newRow.insertCell(0);
      let valueCell = newRow.insertCell(1);
      statCell.innerText = stat;
      valueCell.innerText = stats[stat];
    }

    const ctx = document.getElementById('kills-deaths-chart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Kills', 'Deaths'],
        datasets: [{
          data: [kills, deaths],
          backgroundColor: ['#4caf50', '#f44336'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const label = tooltipItem.label || '';
                const value = tooltipItem.raw || 0;
                const total = kills + deaths;
                const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
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
  