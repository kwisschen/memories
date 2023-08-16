let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let clickedPattern = [];
let gameStarted = false;
let bgmStarted = false;
let lastTapTime = 0;
let level = 0;

const audioElements = {};
const audioFiles = ["red", "green", "blue", "yellow", "uh-oh", "next", "upbeat-guitar",];

$(document).ready(function() {
    audioFiles.forEach(function(name) {
        const audio = new Audio("assets/audio/" + name + ".mp3");
        audio.preload = "auto";
        if (name === "upbeat-guitar") {
            audio.loop = true;
        }
        audioElements[name] = audio; // Store the preloaded Audio object
    });
    $("h1").addClass("showtime");
    setTimeout(function() {
        $("h1").removeClass("showtime");
        $("#bgm").addClass("first-flip");
    }, 1200);
    setTimeout(function() {
        $("h3").css({
            transform: 'translateX(0)',
            opacity: 1,
            });
    }, 1200);
    setTimeout(function() {
        $("#level-title").css({
            transform: 'translateY(0)',
            opacity: 1
          });
        $("#bgm").removeClass("first-flip");
        $("#bgm img").removeClass("reversed");
    }, 1800);

    $("#bgm").click(function() {
        if (!bgmStarted) {
            bgmStarted = true;
            playSound("upbeat-guitar");
            $("#bgm").html("<img src='assets/images/music-off.png' alt='turn off music'>");
            $("#bgm").toggleClass("reversed");
        }
        else if (bgmStarted) {
            bgmStarted = false;
            bgm.pause();
            bgm.currentTime = 0;
            $("#bgm").html("<img src='assets/images/music-on.png' alt='turn on music'>");
            $("#bgm").toggleClass("reversed");
        }
        $(this).blur();
    });
    $(document).on("keydown", function(event) {
        if (event.key === " " && level === 0) {
            if (!gameStarted) {
                $("#level-title").text("Click every given button in the correct order!");
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

        if (timeSinceLastTap < 300 && !$(event.target).hasClass("btn")) {
            if (!gameStarted && level === 0) {
                $("#level-title").text("Click every given button in the correct order!");
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

});

function playSound(name) {
    if (audioElements[name]) {
        audioElements[name].play();
        audioElements[name].currentTime = 0;
    } else {
        console.error("Audio not preloaded:", name);
    }
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
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

// Checks index and length of every color within two patterns and starts next round or game over
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === clickedPattern[currentLevel]) {
        if (clickedPattern.length === gamePattern.length) {
            playSound("next");
            setTimeout(function() {
                if (gameStarted) {
                    nextSequence();
                }
            }, 1500)
        }
    }
    else {
        let message = "";
        switch (true) {
            case level > 15:
                message = "GAME OVER <br>Hmm...I think you might have a photographic memory, calling the FBI...<br>(the <strong>F</strong>unny <strong>B</strong>unny <strong>I</strong>nvesti-gators!)<br><img src='assets/images/gator.jpeg' class='game-image' alt='FBI gators'>";
                break;
            case level > 10:
                message = "GAME OVER <br>You are a magnificent unicorn, glistening in the morning sun!";
                break;
            case level > 6:
                message = "GAME OVER <br>Wow that was amazing!";
                break;
            case level > 3:
                message = "GAME OVER <br>Not bad at all!";
                break;
            default:
                message = "GAME OVER <br>Let's give it another shot!";
        }
        playSound("uh-oh");
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


