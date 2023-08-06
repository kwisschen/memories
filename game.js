let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let clickedPattern = [];
let gameStarted = false;
let gameOver = false;
let level = 0;

$(document).on("keydown", function() {
    if (!gameStarted) {
        $("#level-title").text("Level " + level);
        nextSequence();
        gameStarted = true;
    }
});

$(".btn").on("click", function() {
    const clickedColor = $(this).attr("id");
    clickedPattern.push(clickedColor);
    playSound(clickedColor);
    animatePress(clickedColor);
    checkAnswer(clickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === clickedPattern[currentLevel]) {
        console.log("Success")
        if (clickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000)
        }
    }
    else {
        let message = "";

        switch (true) {
            case level > 15:
                message = "Game over. Hmm...do you have a photographic memory?";
                break;
            case level > 10:
                message = "Game over. Your memory is as good as an elephant! ";
                break;
            case level > 6:
                message = "Game over. Pretty impressive!";
                break;
            case level > 3:
                message = "Game over. Not bad!";
                break;
            default:
                message = "Game over. Try again!";
        }
        if (!gameOver) {
            gameOver = true;
            const audio = new Audio("sounds/wrong.mp3");
            audio.play();
            $("body").addClass("game-over");
            setTimeout(function() {
                $("body").removeClass("game-over");
            }, 200);
            $("h1").text(message);
            setTimeout(function() {
                $("h1").text("Press a Key to Start");
                }, 2000);
        }
    }
};

function nextSequence() {
    clickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    const randomNumber = Math.floor(Math.random() * 4);
    const randomColor = buttonColors[randomNumber];
    gamePattern.push(randomColor);
    $("#" + randomColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomColor);
};

function playSound(name) {
    const audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
};

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
};
