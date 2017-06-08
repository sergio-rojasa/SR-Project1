var Game = function() {
  this.power = false;
  this.strictMode = false;
  this.currentStep = 0;
  this.audio = {
    'green': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    'red':  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    'yellow': new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    'blue':  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  };
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
  var pad = document.getElementById('green');

  pad.classList.add('click');

 setTimeout(function() {
    pad.classList.remove('click');
  }, this.speed / 2);
};

var simon = new Game();
