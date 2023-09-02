//board
let board;
let boardWidth = 640;
let boardHeight = 420;
let context;

//bird
let birdWidth = 70;
let birdheight = 40;
let birdx = boardWidth / 12;
let birdy = boardHeight / 2;
let birdImg;

let bird = {
  x: birdx,
  y: birdy,
  width: birdWidth,
  height: birdheight,
};

// bird image
let birdImages = [];
birdImg = new Image();
birdImg.src = "img/bird.png";
birdImages.push(birdImg);

let birdFlyingImg = new Image();
birdFlyingImg.src = "img/flybird.png";
birdImages.push(birdFlyingImg);

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 320;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//pipe Images
topPipeImg = new Image();
topPipeImg.src = "img/pipeup.png";

bottomPipeImg = new Image();
bottomPipeImg.src = "img/pipebottom.png";

//physics
let velocityX = -2; //pipes moving left  speed
let velocityY = 0; //bird jump speed
let gravity = 0.4; //downwards bird after jump

let gameOver = false;
let score = 0;
let gameStarted = false;
let isFlying = false;
let isScrollLocked = false;

//pop up game over
let gameOverPopup;
let finalScoreText;

//sounds
let sound_point = new Audio("sounds/point.mp3");
let sound_die = new Audio("sounds/die.mp3");
let sound_fly = new Audio("sounds/fly.mp3");
let sound_gameover = new Audio("sounds/gameover.mp3");

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  let birdImg; // Declare birdImg before birdImages

  //load Images
  birdImg = birdImages[0];

  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  // Add an event listener to start the game when Enter is pressed
  document.addEventListener("keydown", function (e) {
    if (!gameStarted && (e.code === "Enter" || e.code === "NumpadEnter")) {
      gameStarted = true;
      isScrollLocked = true;
      document.getElementById("message").style.display = "none"; // Hide the message
      requestAnimationFrame(update);
      setInterval(placePipes, 2000);
      toggleScrollLock();
    }
    if (!gameOver) {
      moveBird(e);
    }
  });

  // Gaame over Pop UP
  gameOverPopup = document.getElementById("game-over-popup");
  finalScoreText = document.getElementById("final-score");

  if (gameOverPopup) {
    const playAgainButton = document.getElementById("play-again-button");

    // Add an event listener to reload the game when button play again is pressed
    playAgainButton.addEventListener("click", function () {
      // Hide the game over popup
      gameOverPopup.style.display = "none";

      // Reload the page
      location.reload();
    });
  }
};

function toggleScrollLock() {
  if (isScrollLocked) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // apply gravity and limit the height of fly bird

  // Use the correct bird image based on the flying state
  let currentBirdImage = isFlying ? birdImages[1] : birdImages[0];
  context.drawImage(currentBirdImage, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    endGame();
    return;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      // Stop sound playback if it is running
      if (sound_point.currentTime > 0) {
        sound_point.pause();
        sound_point.currentTime = 0;
      }

      // Start sound playback from the beginning
      sound_point.play();
      score += 5; //because 2 pipes
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      endGame();
      return;
    }
  }

  // Display the score label
  context.fillStyle = "white";
  context.font = "24px Courier New bold";
  context.fillText("Score:", 20, 40); // Adjust the position as needed

  // Display the actual score value
  context.fillText(score, 100, 40); // Adjust the position as needed for the score value
}

function placePipes() {
  if (gameOver) {
    return;
  }

  //(0 - 1) * pipeHeight/2
  // 0 = -80
  // 1 =  -80 - 160 = -240
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if ((e.code == "Space" || e.code == "ArrowUp") && gameStarted) {
    // Stop sound playback if it is running
    if (sound_fly.currentTime > 0) {
      sound_fly.pause();
      sound_fly.currentTime = 0;
    }

    // Start sound playback from the beginning
    sound_fly.play();
    //bird fly
    velocityY = -6;
    isFlying = true;
  }
}

document.addEventListener("keyup", function (e) {
  if (e.code == "Space" || e.code == "ArrowUp") {
    // Returns the bird image to a regular bird when the button is released
    isFlying = false;
  }
});

function detectCollision(bird, pipe) {
  // Calculation of corner points for birds and pipes
  let birdLeft = bird.x;
  let birdRight = bird.x + bird.width;
  let birdTop = bird.y;
  let birdBottom = bird.y + bird.height;

  let pipeLeft = pipe.x;
  let pipeRight = pipe.x + pipe.width;
  let pipeTop = pipe.y;
  let pipeBottom = pipe.y + pipe.height;

  // Check that there is no overlap between the bird and the pipe
  if (
    birdRight > pipeLeft + 7 &&
    birdLeft < pipeRight - 3 &&
    birdBottom > pipeTop + 7 &&
    birdTop < pipeBottom - 7
  ) {
    console.log(birdRight > pipeLeft + 7);
    console.log(birdBottom > pipeTop + 7);
    return true; // There was overlap
  }

  return false; // There wasn`t overlap
}

function endGame() {
  // Show game over popup
  gameOverPopup.style.display = "block";

  // Display the final score
  finalScoreText.textContent = score;

  // Stop the game loop
  gameOver = true;
  isScrollLocked = false;
  toggleScrollLock();
  sound_die.play();
  sound_gameover.play();
}
