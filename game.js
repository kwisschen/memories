let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let clickedPattern = [];
let gameStarted = false;
let bgmStarted = false;
let level = 0;

$(document).ready(function() {
    console.log("doc ready");
    const bgm = new Audio("assets/sounds/acoustic.mp3");
    bgm.loop = true;
    $("#bgm").click(function() {
        if (!bgmStarted) {
            bgmStarted = true;
            bgm.play();
            $("#bgm").html("<img src='assets/images/music-off.png' alt='turn off music'>");
        }
        else if (bgmStarted) {
            bgmStarted = false;
            bgm.pause();
            bgm.currentTime = 0;
            $("#bgm").html("<img src='assets/images/music-on.png' alt='turn on music'>");
        }
        $(this).blur();
    });
    $(document).on("keydown", function(event) {
        if (event.key === " ")
            if (!gameStarted) {
                $("#level-title").text("Level " + level);
                gameStarted = true;
                nextSequence();
            }
    });
    $(".btn").on("click", function() {
        const clickedColor = $(this).attr("id");
        playSound(clickedColor);
        animatePress(clickedColor);
        if (gameStarted) {
            clickedPattern.push(clickedColor);
            checkAnswer(clickedPattern.length - 1);
        } 
    });

    $("#bgm").on("click", function() {
        $(this).toggleClass("flipped");
      });
});

// Checks index and length of every color within two patterns and starts next round or game over
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === clickedPattern[currentLevel]) {
        console.log("Success")
        if (clickedPattern.length === gamePattern.length) {
            const next = new Audio("assets/sounds/next.mp3");
            next.play();
            setTimeout(function() {
                nextSequence();
            }, 2000)
            console.log("Next round")
        }
    }
    else {
        let message = "";

        switch (true) {
            case level > 15:
                message = "Game over. Hmm...do you have a photographic memory?";
                break;
            case level > 10:
                message = "Game over. Your memory is as good as an elephant!";
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
        const wrong = new Audio("assets/sounds/uh-oh.mp3");
        wrong.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h2").text(message);
        restart();
    }
};

function restart() {
    setTimeout(function() {
        $("h2").text("Press Space Bar To Start");
        gameStarted = false;
        gamePattern = [];
        level = 0;
        }, 2000);
}

function nextSequence() {
    clickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    const randomNumber = Math.floor(Math.random() * 4);
    const randomButton = buttonColors[randomNumber];
    gamePattern.push(randomButton);
    setTimeout(function() {
        $("#" + randomButton).fadeIn(100).fadeOut(100).fadeIn(100);
        playSound(randomButton);
    }, 1000)
};

function playSound(name) {
    const audio = new Audio("assets/sounds/" + name + ".mp3");
    audio.play();
};

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
};
