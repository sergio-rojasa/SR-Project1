var Player = function() {
  this.moves = [];
};

Player.prototype.setMove = function(move) {
  this.moves.push(move);
};
Player.prototype.getMove = function(movePosition) {
  return this.moves[movePosition-1];
};
Player.prototype.clearMoves = function() {
  this.moves = [];
};
