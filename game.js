let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let clickedPattern = [];
let gameStarted = false;
let bgmStarted = false;
let level = 0;

$(document).ready(function() {
    console.log("doc ready");
    $("h1").addClass("h1-flash");
    setTimeout(function() {
        $("h1").removeClass("h1-flash");
        $("#bgm").toggleClass("flipped");
    }, 1000);
    setTimeout(function() {
        $("h3").css({
            transform: 'translateX(0)',
            opacity: 1
            });
    }, 1000);
    setTimeout(function() {
        $("#level-title").css({
            transform: 'translateY(0)',
            opacity: 1
          });
    }, 1500);
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
        if (event.key === " " && level === 0) {
            if (!gameStarted) {
                $("#level-title").text("Let's go!");
                setTimeout(function() {
                    nextSequence();
                }, 1000)
                gameStarted = true;
            }
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

function nextSequence() {
    clickedPattern = [];
    level++;
    const randomNumber = Math.floor(Math.random() * 4);
    const randomButton = buttonColors[randomNumber];
    gamePattern.push(randomButton);
    $("#level-title").text("Level " + level);
    setTimeout(function() {
        $("#" + randomButton).fadeIn(100).fadeOut(100).fadeIn(100);
        playSound(randomButton);
    }, 500)
};

function playSound(name) {
    const audio = new Audio("assets/sounds/" + name + ".mp3");
    audio.play();
};

// Checks index and length of every color within two patterns and starts next round or game over
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === clickedPattern[currentLevel]) {
        console.log("Success")
        if (clickedPattern.length === gamePattern.length) {
            const next = new Audio("assets/sounds/next.mp3");
            next.play();
            setTimeout(function() {
                if (gameStarted) {
                    nextSequence();
                }
            }, 1500)
            console.log("Next round")
        }
    }
    else {
        let message = "";

        switch (true) {
            case level > 15:
                message = "Game over. <br>Hmm...I'm pretty sure you have a photographic memory, calling the FBI...<br>(the <strong>F</strong>unny <strong>B</strong>unny <strong>I</strong>nvesti-gators!)";
                break;
            case level > 10:
                message = "Game over. <br>You are a magnificent unicorn, glistening in the morning sun!";
                break;
            case level > 6:
                message = "Game over. <br>...but Wow! You were amazing!";
                break;
            case level > 3:
                message = "Game over. <br>Not bad, but we can do even better!";
                break;
            default:
                message = "Game over. <br>Let's give it another shot!";
        }
        const wrong = new Audio("assets/sounds/uh-oh.mp3");
        wrong.play();
        gameStarted = false;
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h2").html(message);
        restart();
    }
};

function restart() {
    setTimeout(function() {
        $("h2").text("Press Space Bar To Begin");
        gamePattern = [];
        level = 0;
        }, 3000);
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
};
