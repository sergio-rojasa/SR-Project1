var Game = function() {
  this.power = false;
  this.strictMode = false;
  this.signalNumber = 0;
  this.speed = 900;
  this.currentPlayer = null;
  this.players = {};
  this.tones = {
    'green': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    'red':  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    'yellow': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    'blue':  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  };
};

Game.prototype.togglePowerSwitch = function() {
    this.power = !this.power;
};
Game.prototype.getPowerState = function() {
    return this.power;
};

Game.prototype.toggleStrictMode = function() {
    this.strictMode = !this.strictMode;
};
Game.prototype.getStrictMode = function() {
    return this.strictMode;
};

Game.prototype.clearSignalNumber = function() {
    this.signalNumber = 0;
};
Game.prototype.addOneSignal = function() {
    this.signalNumber++;
};
Game.prototype.getCurrentSignalNumber = function() {
    return this.signalNumber;
};

Game.prototype.setCurrentPlayer = function(player) {
        this.currentPlayer = player;
};
Game.prototype.getCurrentPlayer = function() {
    return this.currentPlayer;
};

Game.prototype.addPlayer = function(name) {
    this.players[name] = new Player();
};

Game.prototype.playTone = function(signal) {
    this.tones[signal].play();
}
Game.prototype.lightUpLens = function(signal) {
    var colorLens = document.getElementById(signal);

    colorLens.classList.add('click');
    setTimeout(function() {
        colorLens.classList.remove('click');
    }, this.speed / 2);
};

Game.prototype.updateDisplayScreen = function() {
    var digits = document.getElementById('digits');

    digits.innerHTML = this.getCurrentSignalNumber();
};
Game.prototype.clearDisplayScreen = function() {
    if(!this.getPower()) {
        var digits = document.getElementById('digits');

        digits.innerHTML = "";
    }
};



Game.prototype.togglePowerLed = function() {
    var powerLed = document.getElementById('power');

    if(this.getPower()) {
        powerLed.classList.add('click');
    }
    else {
        powerLed.classList.remove('click');
    }
};
Game.prototype.toggleStrictModeLed = function() {
    var strictModeLed = document.getElementById('strict');

    if(this.getStrictMode()) {
        strictModeLed.classList.add('click');
    }
    else {
        strictModeLed.classList.remove('click');
    }
};

Game.prototype.init = function() {
    this.addPlayer('human');
    this.addPlayer('computer');

    this.players['computer'].generateRandomSignal = function() {
        var numberOfSignals = 4;
        var signals = ['green', 'red', 'yellow', 'blue'];

        var randomSignal = signals[Math.floor(Math.random() * numberOfSignals)];

        return randomSignal;
    }
};



Game.prototype.toggleRestart = function() {
    if(this.getPower()) {
      console.log('power on.');
      this.clearCurrentStep();
      this.setCurrentPlayer('computer');
      this.displayCurrentStep();
    }
    else {
      console.log("power off");
    }
};

var simon = new Game();
simon.init();
