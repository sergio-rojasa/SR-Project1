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

Game.prototype.getStrictMode = function() {
    return this.strictMode;
};
Game.prototype.toggleStrictMode = function() {
    this.strictMode = !this.strictMode;
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
};
Game.prototype.setupEventListeners = function() {
    console.log("Seting up event listeners.");
  /*
  document.body.addEventListener('startComputerTurn', startComputerTurn);
  document.body.addEventListener("onComputerTurnToMove", onComputerTurnToMove);
  document.body.addEventListener('computerFinishedMove', computerFinishedMove);

  document.body.addEventListener('startHumanTurn', startHumanTurn);
  document.body.addEventListener('onHumanTurnToMove', onHumanTurnToMove);
  */
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
      this.clearSignalNumber();
      this.clearEventListeners();
      this.setupEventListeners();
      this.startGame();
    }
};

Game.prototype.startGame = function() {
   var startComputer = new Event('startComputerTurn');
   document.body.dispatchEvent(startComputer);

};
var startComputerTurn = function() {
    console.log("starting computer turn.");

    document.getElementById("green").disabled = true;
    document.getElementById('red').disabled = true;
    document.getElementById('yellow').disabled = true;
    document.getElementById('blue').disabled = true;

    simon.addOneSignal();
    simon.updateDisplayScreen();

    var onComputerTurn = new Event('onComputerTurnToMove');
    document.body.dispatchEvent(onComputerTurn);
};
var onComputerTurnToMove = function() {
    simon.players['computer'].setMove(simon.players['computer'].generateRandomSignal());
    simon.animateComputerMoves(simon.getCurrentSignalNumber());


};
var computerFinishedMove = function() {
    var startHumanTurn = new Event('startHumanTurn');
    document.body.dispatchEvent(startHumanTurn);
};
Game.prototype.animateComputerMoves = function(currentSignalNumber) {
    var index = 0;
    var game = this;
    var computerTurnAnimation = setInterval(function() {
        game.lightUpLens(game.players['computer'].moves[index])
        game.playTone(game.players['computer'].moves[index]);

        index++;
        if(index >= currentSignalNumber) {
            clearInterval(computerTurnAnimation);
            var computerFinished = new Event('computerFinishedMove');
            document.body.dispatchEvent(computerFinished);
        }
    }, 1000);
};

var startHumanTurn = function() {
    console.log('Starting human turn.');
    document.getElementById("green").disabled = false;;
    document.getElementById("red").disabled = false;
    document.getElementById("yellow").disabled = false;
    document.getElementById("blue").disabled = false;

    simon.players['human'].clearMoves();

    var onHumanTurn = new Event('onHumanTurnToMove');
    document.body.dispatchEvent(onHumanTurn);
};
var onHumanTurnToMove = function() {
    console.log("It's the human turn to move.");


};

Game.prototype.checkHumanMove = function(signal) {
    console.log("Checking human move");
    this.players['human'].setMove(signal);


    if(signal != this.players['computer'].moves[this.getCurrentSignalNumber()-1]) {
        alert("Wrong move");
    }
    else if (signal == this.players['computer'].moves[this.getCurrentSignalNumber()-1]) {
        alert("Correct move");
    }

    this.animateHumanMoves(signal)
};


Game.prototype.humanFinishedMove = function() {

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
