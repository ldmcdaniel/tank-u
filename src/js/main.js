var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.tilemap('map', 'images/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'images/terrain_atlas.png');
}

var map;
var water;
var sand;
var grass;
var trees;
var bridges;

function create() {
  map = game.add.tilemap('map');
  map.addTilesetImage('terrain_atlas', 'tiles');
  water = map.createLayer('River');
  sand = map.createLayer('Dirt');
  grass = map.createLayer('Grass');
  trees = map.createLayer('Tree bases');
  bridges = map.createLayer('Tree Tops and Bridges');
}

function update() {

}




