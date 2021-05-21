var Tiles = require('./Tiles.enum');
var Utilities = require('./LevelGenerator.Utilities');

module.exports = {
    yShift: 0,
    generate: function (level, width, height, fromId) {
        Utilities.blockOutLevel(level, width, height);

        let topOffset = 4
        this.yShift = topOffset - 1;
        let bottomOffset = 1;

        let map = new ROT.Map.Cellular(width, height - topOffset - bottomOffset, { connected: true});
        map.randomize(0.5);

        let freeCells = [];
       
        let callback = function (x, y, value) {
            if (value) {
                level.map[x][y + this.yShift] = Tiles.MOUNTAIN;
            }
            else {
                level.map[x][y + this.yShift] = Tiles.GRASS;
                freeCells.push(x + ',' + (y + this.yShift));
            }
        }
        
        for (let i = 0; i < 4; i++) map.create(callback.bind(this));
        
        map.connect(callback.bind(this));
        
        let availableWalls = this._getAvailableWalls(level, width, height);
        
        this._placeEntrance(level, freeCells, fromId);
        
        this._placeVillages(level, freeCells);

        this._placeCaves(level, availableWalls);
    },
    _placeEntrance: function (level, freeCells, fromId) {
        let cell = Utilities.getFreeCell(freeCells);

        level.player.x = cell.x;
        level.player.y = cell.y;
    },
    _placeVillages: function (level, freeCells) {
        let count = Math.floor(10);
        for (let i = 0; i < count; i++) {
            let cell = Utilities.getFreeCell(freeCells);
            level.addVillage(cell.x, cell.y, String(++level.game.world.levelCount), Tiles.VILLAGE);
        }
    },
    _getAvailableWalls: function (level, width, height) {

        let availableWalls = [];

        for (let x = 1; x < width - 1; x++) {
            for (let y = 1; y < height - 1; y++) {
                if (level.map[x][y].name === Tiles.MOUNTAIN.name) {
                    if (this._getNeighbours(level, x, y) > 3) {
                        availableWalls.push(x.toString() + ',' + y.toString());
                    }                    
                }
            }
        }
        return availableWalls;
    },
    _getNeighbours: function (level, x, y) {
        let count = 0;

        if (level.map[x - 1][y - 1].name === Tiles.MOUNTAIN.name) { count++; }
        if (level.map[x][y - 1].name === Tiles.MOUNTAIN.name) { count++; }
        if (level.map[x + 1][y - 1].name === Tiles.MOUNTAIN.name) { count++; }

        if (level.map[x - 1][y].name === Tiles.MOUNTAIN.name) { count++; }
        if (level.map[x + 1][y].name === Tiles.MOUNTAIN.name) { count++; }

        if (level.map[x - 1][y + 1].name === Tiles.MOUNTAIN.name) { count++; }
        if (level.map[x][y + 1].name === Tiles.MOUNTAIN.name) { count++; }
        if (level.map[x + 1][y + 1].name === Tiles.MOUNTAIN.name) { count++; }

        return count;
    },
    _placeCaves: function (level, availableWalls) {
        let count = Math.floor(10);
        for (let i = 0; i < count; i++) {
            let index = Math.floor(ROT.RNG.getUniform() * availableWalls.length);
            let key = availableWalls.splice(index, 1)[0];
            let x = parseInt(key.split(',')[0]);
            let y = parseInt(key.split(',')[1]);
            level.addCave(x, y, String(++level.game.world.levelCount), Tiles.CAVE);
        }
    },
}