PhaserGame.GameWon = {
  create() {
    var titleLabel = game.add.text(100, 100, 'You won!  Your score is ' + score + '.', {font: '50px Arial', fill: '#eeeeee'});
    var startLabel = game.add.text(100, game.world.height-100, 'Click to Restart', {font: '20px Arial', fill: '#eeeeee'});
    game.input.onDown.addOnce(this.restart, this);
  },
  restart() {
    game.state.start('Boot');
  }
}

game.state.add('GameWon', PhaserGame.GameWon);
game.state.start('Boot');