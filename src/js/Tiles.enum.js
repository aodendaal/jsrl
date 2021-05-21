module.exports = {
	BARRIER: {
		name: 'BARRIER',
		tile: new ut.Tile(' ', 255, 255, 255),
		darkTile: new ut.Tile(' ', 128, 128, 128),
		solid: true,
		opaque: false
	},
	VILLAGE: {
		name: 'VILLAGE',
		tile: new ut.Tile('V', 213, 62, 79),
		darkTile: new ut.Tile('V', 128, 128, 128),
		solid: false,
		opaque: false
	},
	CAVE: {
		name: 'CAVE',
		tile: new ut.Tile('C', 213, 62, 79),
		darkTile: new ut.Tile('C', 128, 128, 128),
		solid: false,
		opaque: true
	},
	RICEPADDY: {
		name: 'RICEPADDY',
		tile: new ut.Tile('"', 254, 224, 139),
		darkTile: new ut.Tile('"', 128, 128, 128),
		solid: false,
		opaque: false
	},
	GRASS: {
		name: 'GRASS',
		tile: new ut.Tile('.', 171, 221, 164),
		darkTile: new ut.Tile('.', 128, 128, 128),
		solid: false,
		opaque: false
	},
	MOUNTAIN: {
		name: 'MOUNTAIN',
		tile: new ut.Tile('▲', 94, 79, 162),
		darkTile: new ut.Tile('▲', 128, 128, 128),
		solid: true,
		opaque: true
	},
	FLOOR: {
		name: 'FLOOR',
		tile: new ut.Tile('.', 224, 243, 248),
		darkTile: new ut.Tile('.', 128, 128, 128),
		solid: false,
		opaque: false
	},
	MAZEFLOOR: {
		name: 'MAZEFLOOR',
		tile: new ut.Tile('.', 231, 212, 232),
		darkTile: new ut.Tile('.', 128, 128, 128),
		solid: false,
		opaque: false
	},
	WALL: {
		name: 'WALL',
		tile: new ut.Tile('#', 171, 217, 233),
		darkTile: new ut.Tile('#', 128, 128, 128),
		solid: true,
		opaque: true
	},
	FENCE: {
		name: 'FENCE',
		tile: new ut.Tile('=', 213, 62, 79),
		darkTile: new ut.Tile('=', 128, 128, 128),
		solid: true,
		opaque: true
	},
	MAZEWALL: {
		name: 'MAZEWALL',
		tile: new ut.Tile('=', 194, 165, 207),
		darkTile: new ut.Tile('=', 128, 128, 128),
		solid: true,
		opaque: true
	},
	STAIRS_DOWN: {
		name: 'STAIRS_DOWN',
		tile: new ut.Tile('>', 253, 174, 97),
		darkTile: new ut.Tile('>', 128, 128, 128),
		solid: false,
		opaque: false
	},
	STAIRS_UP: {
		name: 'STAIRS_UP',
		tile: new ut.Tile('<', 253, 174, 97),
		darkTile: new ut.Tile('<', 128, 128, 128),
		solid: false,
		opaque: false
	},
	BUSH: {
		name: 'BUSH',
		tile: new ut.Tile('&', 171, 221, 164),
		darkTile: new ut.Tile('&', 128, 128, 128),
		solid: true,
		opaque: true
	},
	WATER: {
		name: 'WATER',
		tile: new ut.Tile('~', 50, 136, 189),
		darkTile: new ut.Tile('~', 128, 128, 128),
		solid: true,
		opaque: false
	}
}