'use strict';

var map, water, sand, grass, trees, bridges, game, marker, layer, cursors, PhaserGame, currentTile;

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

PhaserGame = function () {};

PhaserGame.prototype = {
  preload: function preload() {
    //This adds the json file from tiles of the map and my images
    this.load.tilemap('map', 'assets/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('terrain', 'assets/terrain_atlas.png');
    this.load.image('turrets', 'assets/turrets32.png');
    this.load.image('tank', 'assets/enemy10.png');
    this.points = {
      'x': [-16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860],
      'y': [130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800]
    };
    this.pi = 0;
  },
  create: function create() {
    this.map = this.add.tilemap('map');
    //The first param is the name of the tileset from tiled; the second is from game.load.image
    this.map.addTilesetImage('terrain_atlas', 'terrain');
    this.map.addTilesetImage('turrets32', 'turrets');
    //Layers from my map
    this.road = this.map.createLayer('Road');
    this.grass = this.map.createLayer('Grass');
    this.trees = this.map.createLayer('Tree bases');
    this.turrets = this.map.createLayer('Turrets');
    //Enemy sprite and travel path information
    this.test = this.add.sprite(-16, 116, 'tank');
    // this.test.scale.setTo(1, 1);
    this.test.anchor.set(0.5);
    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
    this.plot();
    this.bridges = this.map.createLayer('Tree Tops and Bridges');
    //Mouse marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);
    currentTile = this.map.getTile(30, 0, 'Turrets');
    this.cursors = game.input.keyboard.createCursorKeys();
  },
  plot: function plot() {
    //Path plot info for the enemy sprites
    this.path = [];
    var ix = 0;
    var x = 1 / game.width;
    for (var i = 0; i <= 1; i += x) {
      var px = this.math.catmullRomInterpolation(this.points.x, i);
      var py = this.math.catmullRomInterpolation(this.points.y, i);
      //This code was before I put the angle rotation of the ships into the code
      // this.path.push( { x: px, y: py });
      //This draws the path onto the screen to edit the path
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
      var node = { x: px, y: py, angle: 0 };
      if (ix > 0) {
        node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
      }
      this.path.push(node);
      ix++;
    }
    //This code draws rectangles onto the path where the nodes are located
    // for (var p = 0; p < this.points.x.length; p++) {
    //   this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    // }
  },

  update: function update() {
    //Marks the current location of the mouse
    marker.x = this.turrets.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = this.turrets.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown) {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
        currentTile = this.map.getTile(this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y), 'Turrets');
      } else {
        if (this.map.getTile(this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y)) !== currentTile) {
          this.map.putTile(currentTile, this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y), 'Turrets');
        }
      }
    }
    //Information for the path of enemy sprite
    this.test.x = this.path[this.pi].x;
    this.test.y = this.path[this.pi].y;
    this.test.rotation = this.path[this.pi].angle;
    this.pi++;
    if (this.pi >= this.path.length) {
      this.pi = 0;
    }
  }
};

game.state.add('Game', PhaserGame, true);
//# sourceMappingURL=data:application/json;base64,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SSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNyRCxtQkFBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7T0FDN0csTUFBTTtBQUNMLFlBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsRUFBRTtBQUN0RyxjQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQTtTQUMzRztPQUNGO0tBQ0Y7O0FBRUQsUUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxRQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDOUMsUUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ1YsUUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQy9CLFVBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ2I7R0FDRjtDQUNGLENBQUE7O0FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1hcCwgd2F0ZXIsIHNhbmQsIGdyYXNzLCB0cmVlcywgYnJpZGdlcywgZ2FtZSwgbWFya2VyLCBsYXllciwgY3Vyc29ycywgUGhhc2VyR2FtZSwgY3VycmVudFRpbGU7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDEwMjQsIDc2OCwgUGhhc2VyLkFVVE8sICdnYW1lJyk7XG5cblBoYXNlckdhbWUgPSBmdW5jdGlvbiAoKSB7fTtcblxuUGhhc2VyR2FtZS5wcm90b3R5cGUgPSB7XG4gIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvL1RoaXMgYWRkcyB0aGUganNvbiBmaWxlIGZyb20gdGlsZXMgb2YgdGhlIG1hcCBhbmQgbXkgaW1hZ2VzXG4gICAgdGhpcy5sb2FkLnRpbGVtYXAoJ21hcCcsICdhc3NldHMvcml2ZXItZGVmZW5zZS5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTik7XG4gICAgdGhpcy5sb2FkLmltYWdlKCd0ZXJyYWluJywgJ2Fzc2V0cy90ZXJyYWluX2F0bGFzLnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgndHVycmV0cycsICdhc3NldHMvdHVycmV0czMyLnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgndGFuaycsICdhc3NldHMvZW5lbXkxMC5wbmcnKTtcbiAgICB0aGlzLnBvaW50cz0ge1xuICAgICAgJ3gnOiBbLTE2LCAxMDAsIDIwMCwgMzAwLCA0MDAsIDUwMCwgNjAwLCA3MDAsIDc0MCwgNjc1LCA2MDAsIDUwMCwgNDAwLCAzMDAsIDIwNSwgMTgwLCAxOTAsIDI5MCwgMzkwLCA0OTAsIDU5MCwgNjkwLCA3OTAsIDg1MCwgODYwXSxcbiAgICAgICd5JzogWzEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxNDUsIDE2MCwgMTgwLCAyNTAsIDMxMCwgMzQwLCAzNTAsIDM1MCwgMzY1LCA0MDAsIDQ3NSwgNTUwLCA1OTAsIDYxMCwgNjIzLCA2MzAsIDYzOCwgNjUwLCA3MjAsIDgwMF1cbiAgICB9O1xuICAgIHRoaXMucGkgPSAwO1xuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1hcCA9IHRoaXMuYWRkLnRpbGVtYXAoJ21hcCcpO1xuICAgIC8vVGhlIGZpcnN0IHBhcmFtIGlzIHRoZSBuYW1lIG9mIHRoZSB0aWxlc2V0IGZyb20gdGlsZWQ7IHRoZSBzZWNvbmQgaXMgZnJvbSBnYW1lLmxvYWQuaW1hZ2VcbiAgICB0aGlzLm1hcC5hZGRUaWxlc2V0SW1hZ2UoJ3RlcnJhaW5fYXRsYXMnLCAndGVycmFpbicpO1xuICAgIHRoaXMubWFwLmFkZFRpbGVzZXRJbWFnZSgndHVycmV0czMyJywgJ3R1cnJldHMnKVxuICAgIC8vTGF5ZXJzIGZyb20gbXkgbWFwXG4gICAgdGhpcy5yb2FkID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ1JvYWQnKTtcbiAgICB0aGlzLmdyYXNzID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ0dyYXNzJyk7XG4gICAgdGhpcy50cmVlcyA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdUcmVlIGJhc2VzJyk7XG4gICAgdGhpcy50dXJyZXRzID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ1R1cnJldHMnKTtcbiAgICAvL0VuZW15IHNwcml0ZSBhbmQgdHJhdmVsIHBhdGggaW5mb3JtYXRpb25cbiAgICB0aGlzLnRlc3QgPSB0aGlzLmFkZC5zcHJpdGUoLTE2LCAxMTYsICd0YW5rJyk7XG4gICAgLy8gdGhpcy50ZXN0LnNjYWxlLnNldFRvKDEsIDEpO1xuICAgIHRoaXMudGVzdC5hbmNob3Iuc2V0KDAuNSk7XG4gICAgdGhpcy5ibWQgPSB0aGlzLmFkZC5iaXRtYXBEYXRhKGdhbWUud2lkdGgsIGdhbWUuaGVpZ2h0KTtcbiAgICB0aGlzLmJtZC5hZGRUb1dvcmxkKCk7XG4gICAgdGhpcy5wbG90KCk7XG4gICAgdGhpcy5icmlkZ2VzID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ1RyZWUgVG9wcyBhbmQgQnJpZGdlcycpO1xuICAgIC8vTW91c2UgbWFya2VyXG4gICAgbWFya2VyID0gZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICBtYXJrZXIubGluZVN0eWxlKDIsIDB4MDAwMDAwLCAxKTtcbiAgICBtYXJrZXIuZHJhd1JlY3QoMCwgMCwgMzIsIDMyKTtcbiAgICBjdXJyZW50VGlsZSA9IHRoaXMubWFwLmdldFRpbGUoMzAsIDAsICdUdXJyZXRzJylcbiAgICB0aGlzLmN1cnNvcnMgPSBnYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcbiAgfSxcbiAgcGxvdDogZnVuY3Rpb24gKCkge1xuICAgIC8vUGF0aCBwbG90IGluZm8gZm9yIHRoZSBlbmVteSBzcHJpdGVzXG4gICAgdGhpcy5wYXRoID0gW107XG4gICAgdmFyIGl4ID0gMDtcbiAgICB2YXIgeCA9IDEgLyBnYW1lLndpZHRoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IDE7IGkgKz0geCkge1xuICAgICAgdmFyIHB4ID0gdGhpcy5tYXRoLmNhdG11bGxSb21JbnRlcnBvbGF0aW9uKHRoaXMucG9pbnRzLngsIGkpO1xuICAgICAgdmFyIHB5ID0gdGhpcy5tYXRoLmNhdG11bGxSb21JbnRlcnBvbGF0aW9uKHRoaXMucG9pbnRzLnksIGkpO1xuICAgICAgLy9UaGlzIGNvZGUgd2FzIGJlZm9yZSBJIHB1dCB0aGUgYW5nbGUgcm90YXRpb24gb2YgdGhlIHNoaXBzIGludG8gdGhlIGNvZGVcbiAgICAgIC8vIHRoaXMucGF0aC5wdXNoKCB7IHg6IHB4LCB5OiBweSB9KTtcbiAgICAgIC8vVGhpcyBkcmF3cyB0aGUgcGF0aCBvbnRvIHRoZSBzY3JlZW4gdG8gZWRpdCB0aGUgcGF0aFxuICAgICAgLy8gdGhpcy5ibWQucmVjdChweCwgcHksIDEsIDEsICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJyk7XG4gICAgICB2YXIgbm9kZSA9IHt4OiBweCwgeTogcHksIGFuZ2xlOiAwfTtcbiAgICAgIGlmIChpeCA+IDApIHtcbiAgICAgICAgbm9kZS5hbmdsZSA9IHRoaXMubWF0aC5hbmdsZUJldHdlZW5Qb2ludHModGhpcy5wYXRoW2l4IC0gMV0sIG5vZGUpO1xuICAgICAgfVxuICAgICAgdGhpcy5wYXRoLnB1c2gobm9kZSk7XG4gICAgICBpeCsrO1xuICAgIH1cbiAgICAvL1RoaXMgY29kZSBkcmF3cyByZWN0YW5nbGVzIG9udG8gdGhlIHBhdGggd2hlcmUgdGhlIG5vZGVzIGFyZSBsb2NhdGVkXG4gICAgLy8gZm9yICh2YXIgcCA9IDA7IHAgPCB0aGlzLnBvaW50cy54Lmxlbmd0aDsgcCsrKSB7XG4gICAgLy8gICB0aGlzLmJtZC5yZWN0KHRoaXMucG9pbnRzLnhbcF0tMywgdGhpcy5wb2ludHMueVtwXS0zLCA2LCA2LCAncmdiYSgyNTUsIDAsIDAsIDEpJyk7XG4gICAgLy8gfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCl7XG4gICAgLy9NYXJrcyB0aGUgY3VycmVudCBsb2NhdGlvbiBvZiB0aGUgbW91c2VcbiAgICBtYXJrZXIueCA9IHRoaXMudHVycmV0cy5nZXRUaWxlWChnYW1lLmlucHV0LmFjdGl2ZVBvaW50ZXIud29ybGRYKSAqIDMyO1xuICAgIG1hcmtlci55ID0gdGhpcy50dXJyZXRzLmdldFRpbGVZKGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFkpICogMzI7XG5cbiAgICBpZiAoZ2FtZS5pbnB1dC5tb3VzZVBvaW50ZXIuaXNEb3duKSB7XG4gICAgICBpZiAoZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oUGhhc2VyLktleWJvYXJkLlNISUZUKSkge1xuICAgICAgICBjdXJyZW50VGlsZSA9IHRoaXMubWFwLmdldFRpbGUodGhpcy50dXJyZXRzLmdldFRpbGVYKG1hcmtlci54KSwgdGhpcy50dXJyZXRzLmdldFRpbGVZKG1hcmtlci55KSwgJ1R1cnJldHMnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLm1hcC5nZXRUaWxlKHRoaXMudHVycmV0cy5nZXRUaWxlWChtYXJrZXIueCksIHRoaXMudHVycmV0cy5nZXRUaWxlWShtYXJrZXIueSkpICE9PSBjdXJyZW50VGlsZSkge1xuICAgICAgICAgIHRoaXMubWFwLnB1dFRpbGUoY3VycmVudFRpbGUsIHRoaXMudHVycmV0cy5nZXRUaWxlWChtYXJrZXIueCksIHRoaXMudHVycmV0cy5nZXRUaWxlWShtYXJrZXIueSksICdUdXJyZXRzJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvL0luZm9ybWF0aW9uIGZvciB0aGUgcGF0aCBvZiBlbmVteSBzcHJpdGVcbiAgICB0aGlzLnRlc3QueCA9IHRoaXMucGF0aFt0aGlzLnBpXS54O1xuICAgIHRoaXMudGVzdC55ID0gdGhpcy5wYXRoW3RoaXMucGldLnk7XG4gICAgdGhpcy50ZXN0LnJvdGF0aW9uID0gdGhpcy5wYXRoW3RoaXMucGldLmFuZ2xlO1xuICAgIHRoaXMucGkrKztcbiAgICBpZiAodGhpcy5waSA+PSB0aGlzLnBhdGgubGVuZ3RoKSB7XG4gICAgICB0aGlzLnBpID0gMDtcbiAgICB9XG4gIH1cbn1cblxuZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCBQaGFzZXJHYW1lLCB0cnVlKTtcbiJdfQ==
