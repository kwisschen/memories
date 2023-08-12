let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let clickedPattern = [];
let gameStarted = false;
let bgmStarted = false;
let lastTapTime = 0;
let level = 0;

$(document).ready(function() {
    console.log("doc ready");
    $("h1").addClass("h1-flash");
    setTimeout(function() {
        $("h1").removeClass("h1-flash");
        $("#bgm").toggleClass("first-flip");
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
    const bgm = new Audio("assets/audio/upbeat-guitar.mp3");
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
                $("#level-title").text("Click every button in the correct order!");
                setTimeout(function() {
                    nextSequence();
                }, 2000)
                gameStarted = true;
            }
        }
    });
    $(document).on("touchstart", function(event) {
        const currentTime = new Date().getTime();
        const timeSinceLastTap = currentTime - lastTapTime;

        if (timeSinceLastTap < 300) {
            if (!gameStarted && level === 0) {
                $("#level-title").text("Click every button in the correct order!");
                setTimeout(function() {
                    nextSequence();
                }, 2000)
                gameStarted = true;
            }
        }
        lastTapTime = currentTime;
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

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
};

function playSound(name) {
    const audio = new Audio("assets/audio/" + name + ".mp3");
    audio.play();
};

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

// Checks index and length of every color within two patterns and starts next round or game over
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === clickedPattern[currentLevel]) {
        console.log("Success")
        if (clickedPattern.length === gamePattern.length) {
            const next = new Audio("assets/audio/next.mp3");
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
                message = "Game over. <br>Hmm...I think you might have a photographic memory, calling the FBI now...<br>(the <strong>F</strong>unny <strong>B</strong>unny <strong>I</strong>nvesti-gators!)";
                break;
            case level > 10:
                message = "Game over. <br>You are a magnificent unicorn, glistening in the morning sun!";
                break;
            case level > 6:
                message = "Game over. <br>...but WOW you were amazing!";
                break;
            case level > 3:
                message = "Game over. <br>Not bad at all, but we can do even better!";
                break;
            default:
                message = "Game over. <br>Let's give it another shot!";
        }
        const wrong = new Audio("assets/audio/uh-oh.mp3");
        wrong.play();
        gameStarted = false;
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h2").html(message);
        playBackAnswer(gamePattern, 0);
        restart();
    }
};

function playBackAnswer(pattern, index) {
    if (index < pattern.length) {
        setTimeout(function() {
            playSound(pattern[index]);
            playBackAnswer(pattern, index + 1);
        }, 400);
    }
}

function restart() {
    setTimeout(function() {
        $("h2").text("Press Space Bar or Double-Tap To Begin");
        gamePattern = [];
        level = 0;
        }, 3000);
};


