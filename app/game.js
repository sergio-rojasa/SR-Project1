var Game = function() {
  this.power = false;
  this.strictMode = false;
  this.currentStep = 0;
  this.currentPlayer = null;
  this.audio = {
    'green': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    'red':  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    'yellow': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    'blue':  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  };
  this.players = {};
  this.speed = 900;
};

Game.prototype.togglePower = function() {
  this.power = !this.power;
};
Game.prototype.getPower = function() {
  return this.power;
};
Game.prototype.toggleStrictMode = function() {
  this.strictMode = !this.strictMode;
};
Game.prototype.getStrictMode = function() {
  return this.strictMode;
};

Game.prototype.addCurrentStep = function() {
  this.currentStep++;
};
Game.prototype.clearCurrentStep = function() {
  this.currentStep = 0;
};
Game.prototype.getCurrentStep = function() {
  return this.currentStep;
};
Game.prototype.displayCurrentStep = function() {
    var digits = document.getElementById('digits');

    digits.innerHTML = this.getCurrentStep();
};

Game.prototype.getCurrentPlayer = function() {
  return this.currentPlayer;
}
Game.prototype.setCurrentPlayer = function(player) {
  this.currentPlayer = player;
};

Game.prototype.playAudio = function(pad) {
  this.audio[pad].play();
};

Game.prototype.toggleLed = function(led) {
  var led = document.getElementById(led);

  if(this.getPower()) {
    led.classList.add('click');
  }
  else {
    led.classList.remove('click');
  }
};
Game.prototype.toggleStrictModeLed = function() {
  var strict = document.getElementById('strict');

  if(this.getStrictMode()) {
    strict.classList.add('click');
  }
  else {
    strict.classList.remove('click');
  }
}
Game.prototype.lightUp = function(pad) {
  var pad = document.getElementById(pad);

  pad.classList.add('click');

 setTimeout(function() {
    pad.classList.remove('click');
  }, this.speed / 2);
};

Game.prototype.addPlayer = function(name) {
  this.players[name] = new Player();
}

Game.prototype.init = function() {
  this.addPlayer('human');
  this.addPlayer('computer');

  this.players['computer'].generateRandomMove = function() {
    var numberOfColors = 4;
    var colors = ['green', 'red', 'yellow', 'blue'];

    var randomColor = colors[Math.floor(Math.random() * numberOfColors)];
    return randomColor;
  };
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
