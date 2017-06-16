var Game = function() {
    this.power = false;
    this.strictMode = false;
    this.signalNumber = 0;
    this.players = {};
    this.tones = {
        "green": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        "red": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        "yellow": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        "blue": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    };
    this.speed = 900;
};

Game.prototype.getPowerState = function() {
    return this.power;
};
Game.prototype.togglePowerSwitch = function() {
    this.power = !this.power;
};
Game.prototype.togglePowerswitchLight = function() {
    var powerBulb = document.getElementById('powerSwitch');

    if(this.getPowerState()) {
        powerBulb.classList.add('click');
    }
    else {
        powerBulb.classList.remove('click');
    }
};

Game.prototype.getStrictMode = function() {
    return this.strictMode;
};
Game.prototype.toggleStrictMode = function() {
    this.strictMode = !this.strictMode;
};
Game.prototype.toggleStrictModeLight = function() {
   var strictModeBulb = document.getElementById("strictMode");

   if(this.getStrictMode()) {
       strictModeBulb.classList.add("click");
   }
   else {
       strictModeBulb.classList.remove("click");
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
Game.prototype.playTone = function(signal) {
    this.tones[signal].play();
};
Game.prototype.lightUpLens = function(signal) {
    var colorLens = document.getElementById(signal);

    colorLens.classList.add('click');
    setTimeout(function() {
        colorLens.classList.remove('click');
    }, this.speed / 2);
};

Game.prototype.updateDisplayScreen = function() {
    var digits = document.getElementById("digits");
    digits.innerHTML = this.getCurrentSignalNumber();
};
Game.prototype.clearDisplayScreen = function() {
    var digits = document.getElementById("digits");
    digits.innerHTML = "";
};

Game.prototype.clearEventListeners = function() {
    console.log("Clear event listeners.");
    document.removeEventListener("startComputerTurnEvent", this.startComputerTurnEvent);
    document.removeEventListener("onComputerTurnToMoveEvent", this.onComputerTurnToMoveEvent);
    document.removeEventListener("computerFinishedMoveEvent", this.computerFinishedMoveEvent);

    document.removeEventListener("startHumanTurnEvent", this.startHumanTurnEvent);
    document.removeEventListener("checkHumanMoveEvent", this.checkHumanMoveEvent);
    document.removeEventListener("humanFinishedMoveEvent", this.humanFinishedMoveEvent);
};
Game.prototype.setupEventListeners = function() {
    console.log("Seting up event listeners.");
    document.addEventListener("startComputerTurnEvent", this.startComputerTurnEvent);
    document.addEventListener("onComputerTurnToMoveEvent", this.onComputerTurnToMoveEvent);
    document.addEventListener("computerFinishedMoveEvent", this.computerFinishedMoveEvent);

    document.addEventListener("startHumanTurnEvent", this.startHumanTurnEvent);
    document.addEventListener("checkHumanMoveEvent", this.checkHumanMoveEvent);
    document.addEventListener("humanFinishedMoveEvent", this.humanFinishedMoveEvent);
};

Game.prototype.enableColorLens = function() {
    document.getElementById("green").disabled = false;;
    document.getElementById("red").disabled = false;
    document.getElementById("yellow").disabled = false;
    document.getElementById("blue").disabled = false;
};
Game.prototype.disableColorLens = function() {
    document.getElementById("green").disabled = true;
    document.getElementById('red').disabled = true;
    document.getElementById('yellow').disabled = true;
    document.getElementById('blue').disabled = true;
};

Game.prototype.init = function() {
    this.addPlayer("human");
    this.addPlayer("computer");

    this.players["computer"].generateRandomSignal = function() {
        var numberOfSignals = 4;
        var signals = ["green", "red", "yellow", "blue"];
        var randomSignal = signals[Math.floor(Math.random() * numberOfSignals)];

        return randomSignal;
    };
};
Game.prototype.toggleRestart = function() {
    if(this.getPowerState()) {
        console.log("Toggle restart");
        simon.players["computer"].clearMoves();
        simon.players["human"].clearMoves();
        this.clearDisplayScreen();
        this.clearSignalNumber();
        this.clearEventListeners();
        this.setupEventListeners();
        this.startGame();
    }
};
Game.prototype.startGame = function() {
    console.log("Starting game");
    var startComputerTurnEvent = new Event("startComputerTurnEvent");
    document.dispatchEvent(startComputerTurnEvent);
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
    console.log("Computer finished move event");

    var startHumanTurnEvent = new Event("startHumanTurnEvent");
    document.dispatchEvent(startHumanTurnEvent);
};
Game.prototype.animateComputerMoves = function(currentSignalNumber) {
    console.log("animating computer moves");

    var game = this;
    var index = 0;

    var computerTurnAnimation = setInterval(function() {
        var computerSignal = game.players["computer"].moves[index];
        game.lightUpLens(computerSignal);
        game.playTone(computerSignal);

        index++;
        if(index >= currentSignalNumber) {
            clearInterval(computerTurnAnimation);

            var computerFinishedMoveEvent = new Event("computerFinishedMoveEvent");
            document.dispatchEvent(computerFinishedMoveEvent);
        }
    }, 1000);

};

Game.prototype.startHumanTurnEvent = function() {
    console.log("starting human turn event");

    simon.enableColorLens();
    simon.players["human"].clearMoves();
};
Game.prototype.checkHumanMoveEvent = function(humanSignal) {
    console.log("checking human move event");

    var computerIndex = 0;
    var computerSignal = this.players["computer"].moves[computerIndex];

    this.players["human"].setMove(humanSignal);
    this.animateHumanMoves(humanSignal);

    if(humanSignal != computerSignal && this.getStrictMode()) {
        alert("Wrong move");
        return simon.toggleRestart();
    }
    else if(humanSignal === computerSignal) {
        alert("Correct move")

    }

    simon.humanFinishedMoveEvent();

};
Game.prototype.humanFinishedMoveEvent = function() {
    console.log("human finished move event");

    var startComputerTurnEvent = new Event("startComputerTurnEvent");
    document.dispatchEvent(startComputerTurnEvent);
};


 Game.prototype.animateHumanMoves = function(signal) {
    console.log(signal)
    var index = 0;
    var game = this;
    var humanTurnAnimation = setInterval(function() {
        game.lightUpLens(signal)
        game.playTone(signal);

        index++;
        if(index >= game.getCurrentSignalNumber()) {
            clearInterval(humanTurnAnimation);
        //    var computerFinished = new Event('computerFinishedMove');
        //    document.body.dispatchEvent(computerFinished);
        }
    }, 1000);
};
var simon = new Game();
simon.init();
