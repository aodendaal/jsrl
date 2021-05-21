var ItemType = require('./ItemType.enum')

module.exports = {
	IRON_SWORD: {
		type: ItemType.WEAPON,
		name: 'Iron Sword',
		tile: new ut.Tile(')', 249, 65, 68),
		strength: 2
	},
	HEALTH_POTION: {
		type: ItemType.CONSUME,
		name: 'Red Potion',
		tile: new ut.Tile('!', 94, 79, 162),
		use: function(game) {
			let amount = Math.floor(game.player.maxHitPoints / 2);
			game.display.message(`You gain ${amount} hit points.`);

			game.player.hitPoints += amount;
			if (game.player.hitPoints > game.player.maxHitPoints) {
				game.player.hitPoints = game.player.maxHitPoints;
			}
		}
	},
	BOOK_OF_MIRDAS: {
		type: ItemType.BOOK,
		name: 'Book of Mirdas',
		tile: new ut.Tile('+', 249, 65, 68)
	},
	BOOK_OF_AURORA: {
		type: ItemType.BOOK,
		name: 'Book of Aurora',
		tile: new ut.Tile('+', 249, 65, 68),
		targetted: true
	},
	SPELL_OF_LOLZORS: {
		type: ItemType.SPELL,
		name: 'Spell of Lolzors',
		tile: new ut.Tile('?', 249, 65, 68)	
	}
}