var Game = function() {
    this.power = false;
    this.strictMode = false;
    this.signalNumber = 0;
    this.speed = 800;
    this.players = {};
    this.tones = {
        "green": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        "red": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        "yellow": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        "blue": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    };
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
Game.prototype.checkPowertStateToDisableLens = function() {
    if(!this.getPowerState()) {
        this.disableColorLens();
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
    document.body.removeEventListener("startComputerTurnEvent", this.startComputerTurnEvent);
    document.body.removeEventListener("onComputerTurnToMoveEvent", this.onComputerTurnToMoveEvent);
    document.body.removeEventListener("computerFinishedMoveEvent", this.computerFinishedMoveEvent);

    document.body.removeEventListener("startHumanTurnEvent", this.startHumanTurnEvent);
    document.body.removeEventListener("checkHumanMoveEvent", this.checkHumanMoveEvent);
    document.body.removeEventListener("humanFinishedMoveEvent", this.humanFinishedMoveEvent);

};
Game.prototype.setupEventListeners = function() {
    document.body.addEventListener("startComputerTurnEvent", this.startComputerTurnEvent);
    document.body.addEventListener("onComputerTurnToMoveEvent", this.onComputerTurnToMoveEvent);
    document.body.addEventListener("computerFinishedMoveEvent", this.computerFinishedMoveEvent);

    document.body.addEventListener("startHumanTurnEvent", this.startHumanTurnEvent);
    document.body.addEventListener("checkHumanMoveEvent", this.checkHumanMoveEvent);
    document.body.addEventListener("humanFinishedMoveEvent", this.humanFinishedMoveEvent);
};

Game.prototype.startComputerTurnEvent = function(e) {
    var game = e.detail;
    game.disableColorLens();
    game.addOneSignalNumber();
    game.updateDisplayScreen();

    var onComputerTurnToMoveEvent = new CustomEvent("onComputerTurnToMoveEvent", {"detail": game});
    document.body.dispatchEvent(onComputerTurnToMoveEvent);
};
Game.prototype.onComputerTurnToMoveEvent = function(e) {
    var game = e.detail;
    var generatedRandomSignal = game.players["computer"].generateRandomSignal();
    game.players["computer"].setMove(generatedRandomSignal);

    game.animateComputerMoves(game.getCurrentSignalNumber());
};
Game.prototype.computerFinishedMoveEvent = function(e) {
    var game = e.detail;
    var startHumanTurnEvent = new CustomEvent("startHumanTurnEvent", {"detail": game});
    document.body.dispatchEvent(startHumanTurnEvent);
};
Game.prototype.animateComputerMoves = function(currentSignalNumber) {
    var game = this;
    var signal = 1;


    var computerMovesAnimation = setInterval(function() {
        var computerSignal = game.players["computer"].moves[signal-1];

        game.lightUpLens(computerSignal);
        game.playTone(computerSignal);

        if(signal >= currentSignalNumber) {
            clearInterval(computerMovesAnimation);

            var computerFinishedMoveEvent = new CustomEvent("computerFinishedMoveEvent", {"detail": game});
            document.body.dispatchEvent(computerFinishedMoveEvent);
        }
        signal = signal + 1;
    }, 1000);
};


Game.prototype.startHumanTurnEvent = function(e) {
    var game = e.detail;
    game.enableColorLens();
    game.players["human"].clearMoves();

    startWaitForHuman(game);
};

var timer;
function startWaitForHuman(game) {

    timer = setTimeout(function() {
        return game.toggleRestart();
    }, 5000);

}
function stopWaitForHuman() {
    clearTimeout(timer);
}

Game.prototype.checkHumanMoveEvent = function(humanSignal) {
    stopWaitForHuman();
    this.players["human"].setMove(humanSignal);
    this.lightUpLens(humanSignal);
    this.playTone(humanSignal);

    var currentSignalNumber = this.getCurrentSignalNumber();
    var humanTotalMoves = this.players["human"].moves.length;
    var computerSignal = this.players["computer"].moves[humanTotalMoves-1];


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
            var humanFinishedMoveEvent = new CustomEvent("humanFinishedMoveEvent", {"detail": this});
            document.body.dispatchEvent(humanFinishedMoveEvent);
        }
    }
};
Game.prototype.humanFinishedMoveEvent = function(e) {
    var game = e.detail;
    var startComputerTurnEvent = new CustomEvent("startComputerTurnEvent", {"detail": game});
    document.body.dispatchEvent(startComputerTurnEvent);
};

Game.prototype.init = function() {
    this.addPlayer("human");
    this.addPlayer("computer");

    this.players["computer"].generateRandomSignal = function() {
        var numberOfSignals = 4;
        var signals = ["green", "red", "yellow", "blue"];

        var generatedRandomSignal = signals[Math.floor(Math.random() * numberOfSignals)];

        return generatedRandomSignal;
    };
    this.disableColorLens();
};
Game.prototype.toggleRestart = function() {
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

    var startComputerTurnEvent = new CustomEvent("startComputerTurnEvent", {"detail": this});
    document.body.dispatchEvent(startComputerTurnEvent);
};
var simon = new Game();
simon.init();
