



var Game = function() {
    this.power = false;
    this.strictMode = false;
    this.signalNumber = 0;
    this.speed = 900;
    this.players = {};
    this.tones = {
        "green": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        "red": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        "yellow": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        "blue": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    };
    this.humanPressedButton = false;
};



Game.prototype.getPowerState = function() {
    return this.power;
};
Game.prototype.togglePowerSwitch = function() {
    this.power = !this.power;
};
Game.prototype.togglePowerSwitchLight = function() {
    var powerSwitchLightBulb = document.getElementById("powerSwitch");
    if(this.getPowerState()) {
        powerSwitchLightBulb.classList.add("click");
    }
    else {
        powerSwitchLightBulb.classList.remove("click");
    }
};

Game.prototype.getStrictModeState = function() {
    return this.strictMode;
};
Game.prototype.toggleStrictMode = function() {
    this.strictMode = !this.strictMode;
};
Game.prototype.toggleStrictModeLight = function() {
    var strictModeLightBulb = document.getElementById("strictMode");
    if(this.getStrictModeState()) {
        strictModeLightBulb.classList.add("click");
    }
    else {
        strictModeLightBulb.classList.remove("click");
    }
};

Game.prototype.getCurrentSignalNumber = function() {
    return this.signalNumber;
};
Game.prototype.clearSignalNumber = function() {
    this.signalNumber = 0;
};
Game.prototype.addOneSignalNumber = function() {
    this.signalNumber++;
};

Game.prototype.addPlayer = function(name) {
    this.players[name] = new Player();
};
Game.prototype.playTone = function(toneSignal) {
    this.tones[toneSignal].play();
};
Game.prototype.lightUpLens = function(lightSignal) {
    var colorLens = document.getElementById(lightSignal);

    colorLens.classList.add("click");
    setTimeout(function() {
        colorLens.classList.remove("click");
    }, this.speed / 2);

};
Game.prototype.getHumanPressedButton = function() {
    return this.humanPressedButton;
};
Game.prototype.setHumanPressedButton = function(state) {
    this.humanPressedButton = state;
}

Game.prototype.clearDisplayScreen = function() {
    var displayScreen = document.getElementById("displayScreen");

    displayScreen.innerHTML = "";
};
Game.prototype.updateDisplayScreen = function() {
    var displayScreen = document.getElementById("displayScreen");

    displayScreen.innerHTML = this.getCurrentSignalNumber();
};

Game.prototype.disableColorLens = function() {
    document.getElementById("green").disabled = true;
    document.getElementById('red').disabled = true;
    document.getElementById('yellow').disabled = true;
    document.getElementById('blue').disabled = true;
};
Game.prototype.enableColorLens = function() {
    document.getElementById("green").disabled = false;;
    document.getElementById("red").disabled = false;
    document.getElementById("yellow").disabled = false;
    document.getElementById("blue").disabled = false;
};

Game.prototype.clearEventListeners = function() {
    console.log("clear event listeners");
    document.removeEventListener("startComputerTurnEvent", this.startComputerTurnEvent);
    document.removeEventListener("onComputerTurnToMoveEvent", this.onComputerTurnToMoveEvent);
    document.removeEventListener("computerFinishedMoveEvent", this.computerFinishedMoveEvent);

    document.removeEventListener("startHumanTurnEvent", this.startHumanTurnEvent);
//    document.removeEventListener("waitForHumanEvent", this.waitForHumanEvent);
    document.removeEventListener("checkHumanMoveEvent", this.checkHumanMoveEvent);
    document.removeEventListener("humanFinishedMoveEvent", this.humanFinishedMoveEvent);

};
Game.prototype.setupEventListeners = function() {
    console.log("setup event listeners");
    document.addEventListener("startComputerTurnEvent", this.startComputerTurnEvent);
    document.addEventListener("onComputerTurnToMoveEvent", this.onComputerTurnToMoveEvent);
    document.addEventListener("computerFinishedMoveEvent", this.computerFinishedMoveEvent);

    document.addEventListener("startHumanTurnEvent", this.startHumanTurnEvent);
    //document.addEventListener("waitForHumanEvent", this.waitForHumanEvent);
    document.addEventListener("checkHumanMoveEvent", this.checkHumanMoveEvent);
    document.addEventListener("humanFinishedMoveEvent", this.humanFinishedMoveEvent);
};

Game.prototype.startComputerTurnEvent = function() {
    console.log("start computer turn event");

    simon.disableColorLens();
    simon.addOneSignalNumber();
    simon.updateDisplayScreen();

    var onComputerTurnToMoveEvent = new Event("onComputerTurnToMoveEvent");
    document.dispatchEvent(onComputerTurnToMoveEvent);
};
Game.prototype.onComputerTurnToMoveEvent = function() {
    console.log("on computer turn to move event");

    var generatedRandomSignal = simon.players["computer"].generateRandomSignal();
    simon.players["computer"].setMove(generatedRandomSignal);

    simon.animateComputerMoves(simon.getCurrentSignalNumber());

};
Game.prototype.computerFinishedMoveEvent = function() {
    console.log("computer finished move event");

    var startHumanTurnEvent = new Event("startHumanTurnEvent");
    document.dispatchEvent(startHumanTurnEvent);
};
Game.prototype.animateComputerMoves = function(currentSignalNumber) {
    console.log("animate computer moves");
    var game = this;
    var signal = 1;

    var computerMovesAnimation = setInterval(function() {
        var computerSignal = game.players["computer"].moves[signal-1];

        simon.lightUpLens(computerSignal);
        simon.playTone(computerSignal);

        if(signal >= currentSignalNumber) {
            clearInterval(computerMovesAnimation);

            var computerFinishedMoveEvent = new Event("computerFinishedMoveEvent");
            document.dispatchEvent(computerFinishedMoveEvent);
        }
        signal = signal + 1;
    }, 1000);
};


Game.prototype.startHumanTurnEvent = function() {
    console.log("start human turn event");

    simon.enableColorLens();
    simon.players["human"].clearMoves();

    startWaitForHuman();
    //var waitForHumanEvent = new Event("waitForHumanEvent")
    //document.dispatchEvent(waitForHumanEvent);
};

var timer = 0;;
function startWaitForHuman() {
    console.log("start wait for human");

    timer = setTimeout(function() {
        console.log("restart");
        return simon.toggleRestart();
    }, 5000);

}
function stopWaitForHuman() {
    clearTimeout(timer);
}

Game.prototype.checkHumanMoveEvent = function(humanSignal) {
    console.log("check human move event");

    stopWaitForHuman();
    this.players["human"].setMove(humanSignal);
    simon.lightUpLens(humanSignal);
    simon.playTone(humanSignal);

    var currentSignalNumber = this.getCurrentSignalNumber();
    var humanTotalMoves = simon.players["human"].moves.length;

    var computerSignal = simon.players["computer"].moves[humanTotalMoves-1];


    if(humanSignal != computerSignal && this.getStrictModeState()) {
        return this.toggleRestart();
    }
    else if(humanSignal != computerSignal) {
        this.disableColorLens();
        this.animateComputerMoves(this.getCurrentSignalNumber());
    }
    if(humanSignal == computerSignal) {
        computerSignal++;
        if(humanTotalMoves == 20) {
            alert("you won");
        }
        if(humanTotalMoves < currentSignalNumber) {
            startWaitForHuman();
        }
        else  {
            var humanFinishedMoveEvent = new Event("humanFinishedMoveEvent");
            document.dispatchEvent(humanFinishedMoveEvent);
        }
    }
};
Game.prototype.humanFinishedMoveEvent = function() {
    console.log("human finished move event");

    var startComputerTurnEvent = new Event("startComputerTurnEvent");
    document.dispatchEvent(startComputerTurnEvent);
};

Game.prototype.init = function() {
    console.log("init");
    this.addPlayer("human");
    this.addPlayer("computer");

    this.players["computer"].generateRandomSignal = function() {
        var numberOfSignals = 4;
        var signals = ["green", "red", "yellow", "blue"];

        var generatedRandomSignal = signals[Math.floor(Math.random() * numberOfSignals)];

        return generatedRandomSignal;
    };
};
Game.prototype.toggleRestart = function() {
    console.log("toggle restart");
    if(this.getPowerState()) {
        this.players["computer"].clearMoves();
        this.players["human"].clearMoves();

        this.clearSignalNumber();
        this.clearDisplayScreen();

        this.clearEventListeners();
        this.setupEventListeners();

        this.startGame();
    }
};
Game.prototype.startGame = function() {
    console.log("start game");

    var startComputerTurnEvent = new Event("startComputerTurnEvent");
    document.dispatchEvent(startComputerTurnEvent);
};
var simon = new Game();
simon.init();
