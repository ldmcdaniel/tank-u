// var EnemyTank = function (index, game, player) {

//     this.game = game;
//     this.health = 3;
//     this.player = player;
//     this.alive = true;

//     this.tank = game.add.sprite(-16, 116, 'enemy', 'tank1');

//     this.tank.anchor.set(0.5);

//     this.tank.name = index.toString();
//     game.physics.enable(this.tank, Phaser.Physics.ARCADE);

// };

// EnemyTank.prototype.damage = function() {

//     this.health -= 1;

//     if (this.health <= 0)
//     {
//         this.alive = false;
//         this.tank.kill();
//         return true;
//     }

//     return false;

// }

'use strict';

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

var PhaserGame = function PhaserGame() {};

PhaserGame.Boot = function (game) {};

PhaserGame.Boot.prototype = {

  init: function init() {

    this.input.maxPointers = 1;

    // this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
  },

  preload: function preload() {},

  create: function create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.cursors = game.input.keyboard.createCursorKeys();
    this.state.start('Preloader');
  }

};

game.state.add('Boot', PhaserGame.Boot);

//Load the assets needed for your preloader bootscreen here
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy9Cb290LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUUzRCxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsR0FBYyxFQUMzQixDQUFDOztBQUVGLFVBQVUsQ0FBQyxJQUFJLEdBQUcsVUFBVSxJQUFJLEVBQUUsRUFFakMsQ0FBQzs7QUFHRixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRzs7QUFFMUIsTUFBSSxFQUFFLGdCQUFZOztBQUVoQixRQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRSxDQUFDLENBQUM7OztHQUkzQjs7QUFFRCxTQUFPLEVBQUUsbUJBQVksRUFLcEI7O0FBRUQsUUFBTSxFQUFFLGtCQUFZOztBQUVsQixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDdEQsUUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7R0FFOUI7O0NBRUYsQ0FBQzs7QUFFRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9qcy9Cb290LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdmFyIEVuZW15VGFuayA9IGZ1bmN0aW9uIChpbmRleCwgZ2FtZSwgcGxheWVyKSB7XG5cbi8vICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuLy8gICAgIHRoaXMuaGVhbHRoID0gMztcbi8vICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbi8vICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcblxuLy8gICAgIHRoaXMudGFuayA9IGdhbWUuYWRkLnNwcml0ZSgtMTYsIDExNiwgJ2VuZW15JywgJ3RhbmsxJyk7XG5cbi8vICAgICB0aGlzLnRhbmsuYW5jaG9yLnNldCgwLjUpO1xuXG4vLyAgICAgdGhpcy50YW5rLm5hbWUgPSBpbmRleC50b1N0cmluZygpO1xuLy8gICAgIGdhbWUucGh5c2ljcy5lbmFibGUodGhpcy50YW5rLCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4vLyB9O1xuXG4vLyBFbmVteVRhbmsucHJvdG90eXBlLmRhbWFnZSA9IGZ1bmN0aW9uKCkge1xuXG4vLyAgICAgdGhpcy5oZWFsdGggLT0gMTtcblxuLy8gICAgIGlmICh0aGlzLmhlYWx0aCA8PSAwKVxuLy8gICAgIHtcbi8vICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuLy8gICAgICAgICB0aGlzLnRhbmsua2lsbCgpO1xuLy8gICAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9XG5cbi8vICAgICByZXR1cm4gZmFsc2U7XG5cbi8vIH1cblxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoMTAyNCwgNzY4LCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcblxudmFyIFBoYXNlckdhbWUgPSBmdW5jdGlvbiAoKXtcbn07XG5cblBoYXNlckdhbWUuQm9vdCA9IGZ1bmN0aW9uIChnYW1lKSB7XG5cbn07XG5cblxuUGhhc2VyR2FtZS5Cb290LnByb3RvdHlwZSA9IHtcblxuICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICB0aGlzLmlucHV0Lm1heFBvaW50ZXJzPSAxO1xuXG4gICAgLy8gdGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlJFU0laRTtcblxuICB9LFxuXG4gIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIC8vTG9hZCB0aGUgYXNzZXRzIG5lZWRlZCBmb3IgeW91ciBwcmVsb2FkZXIgYm9vdHNjcmVlbiBoZXJlXG5cblxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgdGhpcy5nYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcbiAgICB0aGlzLmN1cnNvcnMgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdQcmVsb2FkZXInKVxuXG4gIH1cblxufTtcblxuZ2FtZS5zdGF0ZS5hZGQoJ0Jvb3QnLCBQaGFzZXJHYW1lLkJvb3QpO1xuIl19
