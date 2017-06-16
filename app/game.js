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

Game.prototype.clearDisplayScreen = function() {
    var displayScreen = document.getElementById("displayScreen");

    displayScreen.innerHTML = "";
};
Game.prototype.updateDisplayScreen = function() {
    var displayScreen = document.getElementById("displayScreen");

    displayScreen.innerHTML = this.getCurrentSignalNumber();
};

var simon = new Game();
simon.init();
