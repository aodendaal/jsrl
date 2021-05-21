var Random = require('./Random');

function Being(game, level, race) {
	this.game = game;
	this.level = level;
	this.tile = race.tile;
	this.name = race.name;
	this.innocent = race.innocent;
	this.x = null;
	this.y = null;
	this.intent = 'CHASE';
}

Being.prototype = {
	act: function () {
		if (!this.innocent) {
			let nearestEnemy = this.getNearestEnemy();
			if (nearestEnemy) {
				if (this.isEnemyAdjacent()) {
					this.attack();
					return;
				}
			}
		}	

		switch (this.intent) {
			case 'RANDOM':
				this.actRandom();
				break;
			case 'CHASE':
				this.actChase();
				break;
		}
	},
	actRandom: function () {
		let dx = Random.n(-1, 1);
		let dy = Random.n(-1, 1);

		if (!this.level.canWalkTo(this.x + dx, this.y + dy)) {
			return;
		}
		this.moveTo(dx, dy);
	},
	actChase: function () {
		var nearestEnemy = this.getNearestEnemy();
		if (!nearestEnemy) {
			return;
		}
		
		let dx = Math.sign(nearestEnemy.x - this.x);
		let dy = Math.sign(nearestEnemy.y - this.y);
		
		if (!this.level.canWalkTo(this.x + dx, this.y + dy)) {
			return;
		}
		this.moveTo(dx, dy);
	},
	attack: function() {
		let damage = Math.floor(ROT.RNG.getNormal(1, 1));
		if (damage < 0) damage = 0;
		this.game.display.message(`${this.name} hits you for ${damage} damage.`);
		this.game.player.hitPoints -= damage;
	},
	getNearestEnemy: function () {
		return this.game.player;
	},
	getEnemyDelta: function () {
		let x = this.x - this.game.player.x;
		let y = this.y - this.game.player.y;

		return { x: x, y: y}
	},
	isEnemyAdjacent: function () {
		let delta = this.getEnemyDelta();
		return Math.abs(delta.x) <= 1 && Math.abs(delta.y) <= 1;
	},
	moveTo: function (dx, dy) {
		this.level.beings[this.x][this.y] = false;
		this.x = this.x + dx;
		this.y = this.y + dy;
		if (!this.level.beings[this.x])
			this.level.beings[this.x] = [];
		this.level.beings[this.x][this.y] = this;
	}
}

module.exports = Being;