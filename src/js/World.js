var Level = require('./Level.class');
var LevelGenerator = require('./LevelGenerator');

module.exports = {
	levels: {},
	init: function (game) {
		this.game = game;
		this.player = game.player;

		this.levels = {},
		this.level = null,

		this.width = 70;
		this.height = 25;

		this.levelCount = 1;

		this.createOverworld();

		//this.loadLevel(String(this.levelCount));
	},
	createOverworld: function () {
		let levelId = 'overworld';

		this.level = new Level(this.game, levelId);
		LevelGenerator.generateOverworld(this.level, this.width, this.height);

		this.levels[levelId] = this.level;
	},
	loadLevel: function (levelId) {
		if (this.levels[levelId]) { // If level already exists
			this.level.exitX = this.player.x;
			this.level.exitY = this.player.y;
			
			this.level = this.levels[levelId];
			
			this.player.x = this.level.exitX;
			this.player.y = this.level.exitY;
		} else {
			if (this.level) {
				this.level.exitX = this.player.x;
				this.level.exitY = this.player.y;
				var previousLevelId = this.level.id;

				this.level = new Level(this.game, levelId);
				LevelGenerator.generateAny(this.level, this.width, this.height, previousLevelId);
			} else {
				this.level = new Level(this.game, levelId);
				LevelGenerator.generateAny(this.level, this.width, this.height);
			}
			this.levels[levelId] = this.level;
		}
	},
	loadVillage: function (levelId) {
		if (this.levels[levelId]) { // If level already exists
			this.level.exitX = this.player.x;
			this.level.exitY = this.player.y;
			
			this.level = this.levels[levelId];
			
			this.player.x = this.level.exitX;
			this.player.y = this.level.exitY;
		} else {
			if (this.level) {
				this.level.exitX = this.player.x;
				this.level.exitY = this.player.y;
				var previousLevelId = this.level.id;

				this.level = new Level(this.game, levelId);
				LevelGenerator.generateVillage(this.level, this.width, this.height, previousLevelId);
			} else {
				this.level = new Level(this.game, levelId);
				LevelGenerator.generateVillage(this.level, this.width, this.height);
			}
			this.levels[levelId] = this.level;
		}
	},
	loadCave: function (levelId) {
		if (this.levels[levelId]) { // If level already exists
			this.level.exitX = this.player.x;
			this.level.exitY = this.player.y;
			
			this.level = this.levels[levelId];
			
			this.player.x = this.level.exitX;
			this.player.y = this.level.exitY;
		} else {
			if (this.level) {
				this.level.exitX = this.player.x;
				this.level.exitY = this.player.y;
				var previousLevelId = this.level.id;

				this.level = new Level(this.game, levelId);
				LevelGenerator.generateCave(this.level, this.width, this.height, previousLevelId);
			} else {
				this.level = new Level(this.game, levelId);
				LevelGenerator.generateCave(this.level, this.width, this.height);
			}
			this.levels[levelId] = this.level;
		}
	}
}