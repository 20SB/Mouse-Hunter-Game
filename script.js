// Starting Msg Div
const startMsg = document.getElementById("start-div");
// name input in start page
const nameInput = document.getElementById("name");
const playerDispName = document.getElementById("player");

// Msg in break
const breakInfo = document.getElementById("breakInfo");

var playerName;
var score;
var ispause = true;
var bonusOn = false;
var clicked = false;

// Start the game
function startGame() {
  // Mouse container that includes its background
  var bonusBox = document.getElementById("bonus-box");
  var bonusMarker = document.getElementsByClassName("bonus-marker");
  // Mouse box containg only mouse image
  var BonusMouse = document.getElementById("bonus-mouse-box");

  // Mouse container that includes its background
  var box = document.getElementById("box");
  // Mouse box containg only mouse image
  var mouse = document.getElementById("mouse-box");

  // Score on main page
  const scoreDiv = document.getElementById("score");
  // Life on main page
  const lifeDiv = document.getElementById("life");
  // Level on main page
  const levelText = document.getElementById("level-text");
  // Clap when level upgrades
  const clap = document.getElementById("clap");

  // Ending Msg Div
  const endMsg = document.getElementById("end-div");
  // Score in Ending Msg
  const scoreCard = document.getElementById("scoreCard");
  // Rank in Ending Msg
  const rankCard = document.getElementById("rankCard");
  // Max Score in Ending Msg
  const maxScore = document.getElementById("maxScore");
  // Rank List Btn on Ending Msg
  const rankListBtn = document.getElementById("rankListBtn");
  // get the play again button on End Msg
  const playAgain = document.getElementById("playAgain");

  // Rank list Div, contains Rank list, Heading etc.
  const rankListDiv = document.getElementById("rank-div");
  // Rank List on Rank list Div, contains just List
  const rankList = document.getElementById("rankList");
  // Close Btn on Rank list DIv
  const closeBtn = document.getElementsByClassName("closeBtn");

  var life = 3;
  var level = 0;
  var presentLevel = 0;
  var dec = 0;
  var countdownInterval;
  var gameTimeout;
  var rank = 1;

  // Set score variable to 0 initially
  score = 0;

  // Generate random number for bonus mouse to be visible
  function getRandomNumber(min, max) {
    // Generate a random decimal number between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale and shift the decimal number to get a random number in the desired range
    const randomInRange = randomDecimal * (max - min + 1) + min;

    // Use Math.floor to truncate the decimal and get an integer result
    return Math.floor(randomInRange);
  }

  // change Position of bonus Mouse
  function changePosition() {
    // find viewport height and width
    let viewport_width = window.innerWidth;
    let viewport_height = window.innerHeight;

    // find mouse bonusBox height width
    let bonusBox_height = bonusBox.clientHeight;
    let bonusBox_width = bonusBox.clientWidth;

    // find new random position where mouse can be placed
    var top = Math.floor(Math.random() * (viewport_height - bonusBox_height));
    var left = Math.floor(Math.random() * (viewport_width - bonusBox_width));
    if (top < 55) {
      top = 55;
    }

    // set mouse at that position
    bonusBox.style.top = top + "px";
    bonusBox.style.left = left + "px";
  }

  // Bonus Div visible Function
  function addBonus() {
    // Generate a random number between 5 and 30
    const randomNumber = getRandomNumber(5, 30);

    // Generate delay time
    let delaySec = randomNumber * 1000;
    // console.log(randomNumber);
    
    // set delay time of delaySec after that make bonus mouse visible
    setTimeout(function () {
      if (!ispause) {
        // if game is not paused then display bonus mouse
        bonusBox.style.display = "flex";
        bonusMarker[0].classList.remove("disp-none");

        // play Ouch music
        playMusic("bonusSound");

        // mark bonus clicked as false
        clicked = false;

        // set delay time of 2 sec to show bonus mouse on screen
        setTimeout(function () {
          // after 2 sec change mouse position and check if bonus mouse is clicked or not
          changePosition();

          if (!clicked) {
            // if clicked just hide it
            bonusBox.style.display = "none";
            bonusMarker[0].classList.add("disp-none");
          }

          // call add bonus function again
          addBonus();
        }, 2000);
      } else {
        // if game is paused then return from bonus, it will be added again when mouse will be clciked
        bonusOn = false; //mark bonus on as false
        return; // Exit the function here
      }
    }, delaySec);
  }

  // function when user clicks on mouse
  BonusMouse.addEventListener("click", function () {
    // mark it as clciked
    clicked = true;

    // increment score value and print it on dom
    score = score + 5;
    scoreDiv.innerHTML = "Score " + score;

    // play Ouch music
    playMusic("ouchSound");

    // hide it
    bonusBox.style.display = "none";
    bonusMarker[0].classList.add("disp-none");

    // check for upgrading level
    levelUpgrade(score);
  });

  // function when user clicks on mouse
  mouse.addEventListener("click", function () {
    // pause Ouch music
    pauseMusic("ouchSound");

    // Mark ispause as false as game is in play mode
    ispause = false;

    // add bonus on play if its not on
    if (!bonusOn) {
      // console.log("bonus is not on, making it on");
      bonusOn = true;
      addBonus();
    }

    // increment score value and print it on dom
    score++;
    scoreDiv.innerHTML = "Score " + score;

    // play Ouch music
    playMusic("ouchSound");

    // Clear game wait timeout which indicates game on pause mode
    clearTimeout(gameTimeout);

    // clear break msg on dom as there is no break mode now
    breakInfo.innerHTML = "";

    // find viewport height and width
    let viewport_width = window.innerWidth;
    let viewport_height = window.innerHeight;

    // find mouse box height width
    let box_height = box.clientHeight;
    let box_width = box.clientWidth;

    // find new random position where mouse can be placed
    var top = Math.floor(Math.random() * (viewport_height - box_height));
    var left = Math.floor(Math.random() * (viewport_width - box_width));
    if (top < 55) {
      top = 55;
    }

    // set mouse at that position
    box.style.top = top + "px";
    box.style.left = left + "px";

    // clear the coundown if exists that was indicating how much time remaining in cathing the previous mouse
    clearInterval(countdownInterval);

    // Start the new countdown timer to tell how much time remaining in cathing that present mouse
    countdownTimer(score);
  });

  // Upade the lives in dom
  function lifeUpdate() {
    let heart = "";
    for (let i = 0; i < life; i++) {
      heart = heart + "❤️";
    }
    if (heart === "") {
      heart = "🖤";
    }
    lifeDiv.innerHTML = heart;
  }
  // Upadate it initially
  lifeUpdate();

  // function to upgrade the level if neccessary
  function levelUpgrade(score) {
    // check if level is upgraded, if so then upgrade and add clap for upgradation else exit
    level = Math.floor(score / 30);
    if (level > presentLevel) {
      // level upgraded so, upgrade present level and show it on dom
      presentLevel = level;
      levelText.innerHTML = " Level " + level;

      // display claping image and clapping sound also
      clap.classList.remove("disp-none");
      playMusic("clapSound");

      // after 9sec hide the clap
      setTimeout(function () {
        clap.classList.add("disp-none");
      }, 9000);
    }
  }

  // Count down timer that is displayed for each mouse indicating how much time remaining to hunt the mouse
  function countdownTimer(score) {
    // upgrade the level
    levelUpgrade(score);

    // set countdown time, decrese 2 sec on each mouse hunt
    var countdown = 15 - 2 * dec++;
    // set minimum time to hunt mouse
    if (countdown <= 2) {
      countdown = 2;
    }
    var seconds = countdown;

    // select the count down div to display it on dom
    var countdownDiv = document.getElementById("countdown");
    countdownDiv.innerHTML = seconds;

    // decrease the time to 0 and dispaly each sec on dom
    countdownInterval = setInterval(function () {
      seconds--;
      countdownDiv.innerHTML = seconds;

      // check if counnt down is over
      if (seconds <= 0) {
        // mark game as pause
        ispause = true;

        // play aww music and clear the countdown interval
        playMusic("awwSound");
        clearInterval(countdownInterval);

        // clear count down text on dom
        countdownDiv.innerHTML = "";
        // decrease the life by 1
        life--;

        if (life == 0) {
          // Last chance of hunting mouse
          // update the life
          lifeUpdate();
          // Show break Msg
          breakInfo.innerHTML = "Last Chance <br> CLICK on mouse to continue";
          // wait for user response to resume for 15 sec only
          waitTimeFunc();
        } else if (life < 0) {
          // no life left
          gameOver();
        } else {
          // update the life
          lifeUpdate();
          // Show break Msg
          breakInfo.innerHTML =
            life + " more chances left <br> CLICK on mouse to continue";
          // wait for user response to resume for 15 sec only
          waitTimeFunc();
        }
      }
    }, 1000);
  }

  // function to wait for 15 sec on pause after user looses to catch the mouse
  function waitTimeFunc() {
    let waitTime = 15;
    gameTimeout = setInterval(function () {
      waitTime--;
      if (waitTime == 0) {
        // Clear game wait timeout which indicates game on pause mode
        clearTimeout(gameTimeout);
        gameOver();
      }
      // console.log(waitTime);
    }, 1000);
  }

  // Game over Function
  function gameOver() {
    // Clear game wait timeout which indicates game on pause mode
    clearTimeout(gameTimeout);

    // pause aww sound and play game over music
    pauseMusic("awwSound");
    playMusic("gameOverSound");

    // creating date as time played at
    const currentDate = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currenMonth = months[currentDate.getMonth()];
    const currenDay = currentDate.getDate();
    const currenYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();

    // Formatting the components to have leading zeros if needed
    const formattedDay = currenDay.toString().padStart(2, "0");
    const formattedHour = currentHour.toString().padStart(2, "0");
    const formattedMinute = currentMinute.toString().padStart(2, "0");
    const formattedSecond = currentSecond.toString().padStart(2, "0");

    // Creating the formatted time to string
    const currentTimeString = `${currenMonth} ${formattedDay} ${currenYear} ${formattedHour}:${formattedMinute}:${formattedSecond}`;

    // Retrieve the stored data from Local Storage using the key
    const storedData = localStorage.getItem("playersData");

    // Parse the JSON string to an array of objects
    let myArray = [];
    if (storedData) {
      myArray = JSON.parse(storedData);
      // console.log("data found");
    } else {
      console.log("No data found");
    }

    // Add new objects to the array
    const newObject = {
      name: playerName,
      score: score,
      time: currentTimeString,
    };
    myArray.push(newObject);

    //sort the array by score
    const compareByIdDescending = (a, b) => {
      return b.score - a.score;
    };
    myArray.sort(compareByIdDescending);

    // Find own rank from sorted array
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].time == currentTimeString) {
        rank = i + 1;
        break;
      }
    }

    // Now update the array to local storage
    const updatedDataToStore = JSON.stringify(myArray);
    localStorage.setItem("playersData", updatedDataToStore);

    // Display the END Msg
    endMsg.classList.remove("disp-none");

    // update score card in End Msg
    rankCard.innerHTML = rank;
    scoreCard.innerHTML = score;
    maxScore.innerHTML =
      myArray[0].score + " by " + myArray[0].name.toUpperCase();
  }

  // Add a click event listener to the play again button
  playAgain.addEventListener("click", function () {
    // Call location.reload() to refresh the page
    location.reload();
  });

  // Add a click event listener to the rank list button
  rankListBtn.addEventListener("click", function () {
    // Display Rank List Div and hide End Msg Div
    rankListDiv.classList.remove("disp-none");
    endMsg.classList.add("disp-none");

    // clear the rank List on DOM initially
    rankList.innerHTML = " ";

    // Retrive data from local storage
    const storedData = localStorage.getItem("playersData");

    // if data found then put it on in an array
    let myArray = [];
    if (storedData) {
      myArray = JSON.parse(storedData);
    } else {
      console.log("No data found");
    }

    // print each data on DOM
    for (let i = 0; i < myArray.length; i++) {
      const li = document.createElement("li");

      li.innerHTML = `
        <div class="pRank">${i + 1}</div>
        <div class="pName">${myArray[i].name}</div>
        <div class="scr">${myArray[i].score}</div>
        <div class="playTime">${myArray[i].time}</div>
        
        `;
      rankList.append(li);
    }
  });

  // Add a click event listener to the Close button on rank list
  closeBtn[0].addEventListener("click", function () {
    rankListDiv.classList.add("disp-none");
    endMsg.classList.remove("disp-none");
  });
}
// startGame();

// function to get player name from staring page
function getPlayerName() {
  playerName = nameInput.value;

  // if player doesnot enters name then put it as guest
  if (playerName == "" || playerName == undefined || playerName == null) {
    playerName = "Guest";
  } else {
    playerName = playerName;
  }

  // Display Player name on DOM
  playerDispName.innerHTML = playerName.toUpperCase();

  // hide starting Msg and move to start the game
  startMsg.classList.add("disp-none");
  breakInfo.innerHTML = "CLICK on mouse to continue";
  startGame();
}

// Select name Form from html and add event listener to its submit button
document
  .getElementById("nameForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    getPlayerName();
  });

// Audio functions
{
  // Create Audio Elements storing object
  let audioElements = {};

  // function to create audio element
  function createAudioElement(audioId, audioSrc) {
    // Create the audio element
    const audio = new Audio();
    audio.src = audioSrc;
    audioElements[audioId] = audio;
  }

  // function to play the music
  function playMusic(audioId) {
    // Create the audio element if not already created
    if (!audioElements[audioId]) {
      if (audioId === "clapSound") {
        createAudioElement("clapSound", "assets/clap.mp3");
      } else if (audioId === "awwSound") {
        createAudioElement("awwSound", "assets/aww-8277.mp3");
      } else if (audioId === "bonusSound") {
        createAudioElement("bonusSound", "assets/game-bonus.mp3");
      } else if (audioId === "gameOverSound") {
        createAudioElement("gameOverSound", "assets/game-over.mp3");
      } else if (audioId === "punchSound") {
        createAudioElement("punchSound", "assets/punch.mp3");
      } else if (audioId === "ouchSound") {
        createAudioElement("ouchSound", "assets/ouch.mp3");
      }
    }

    // if alerdy created then Play the audio
    audioElements[audioId].play();
  }

  // Function to pause the music
  function pauseMusic(audioId) {
    // Pause the audio if it exists
    if (audioElements[audioId]) {
      audioElements[audioId].pause();
    }
  }
}

// set body height and width
function setBodyDimensions() {
  // Find viewport height and width
  let viewport_width = window.innerWidth;
  let viewport_height = window.innerHeight;

  // Set body width and height to viewport dimensions
  document.body.style.width = viewport_width + "px";
  document.body.style.height = viewport_height + "px";
}

// Call the function initially and whenever the window is resized
setBodyDimensions();

// Attach the function to the 'resize' event
window.addEventListener("resize", setBodyDimensions);