var Dungeon = require('./LevelGenerator.Dungeon');
var Cellular = require('./LevelGenerator.Cellular');
var Maze = require('./LevelGenerator.Maze');
var Rogue = require('./LevelGenerator.Rogue');
var Overworld = require('./LevelGenerator.Overworld');
var Village = require('./LevelGenerator.Village');

module.exports = {
	generateAny: function (level, width, height, fromId) {
		let r = Math.floor(ROT.RNG.getUniform() * 5);

		if (r === 0) {
			Maze.generate(level, width, height, fromId);
		}
		else if (r === 1) {
			Dungeon.generate(level, width, height, fromId);
		}
		else if (r === 2) {
			Cellular.generate(level, width, height, fromId);
		}
		else { 
			Rogue.generate(level, width, height, fromId);
		}
	},
	generateOverworld: function (level, width, height, fromId) {
		Overworld.generate(level, width, height, fromId);
	},
	generateVillage: function (level, width, height, fromId) {
		Village.generate(level, width, height, fromId);
	},
	generateCave: function (level, width, height, fromId) {
		Dungeon.generate(level, width, height, fromId);
	}
}