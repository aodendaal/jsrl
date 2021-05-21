var Tiles = require('./Tiles.enum');
var Utilities = require('./LevelGenerator.Utilities');

module.exports = {
    yShift: 0,
    generate: function (level, width, height, fromId) {

        Utilities.blockOutLevel(level, width, height);

        let topOffset = 3
        this.yShift = topOffset - 1;
        let bottomOffset = 1;

        let freeCells = [];

        let map = new ROT.Map.Rogue(width, height - topOffset - bottomOffset);
        let callback = function (x, y, value) {
            if (value) {
                level.map[x][y + this.yShift] = Tiles.WALL;
            }
            else {
                level.map[x][y + this.yShift] = Tiles.FLOOR;
                freeCells.push(x + ',' + (y + this.yShift));
            }
        }
        map.create(callback.bind(this));

        this._placeEntrance(level, freeCells, fromId);

        Utilities.placeBeings(level, freeCells);

        Utilities.placeGold(level, freeCells);

        Utilities.placeItems(level, freeCells);

        this._placeExit(level, freeCells);
    },

    _getRoomCenter: function (rooms, freeCells) {
        let index = Math.floor(ROT.RNG.getUniform() * rooms.length);
        let room = rooms.splice(index, 1)[0];

        let x = room.getLeft() + Math.floor((room.getRight() - room.getLeft()) / 2);
        let y = room.getTop() + this.yShift + Math.floor((room.getBottom() + this.yShift - room.getBottom() + this.yShift) / 2);

        // remove freecell as well
        index = freeCells.indexOf(x + ',' + y);
        freeCells.splice(index, 1)

        return { x: x, y: y };
    },
    _placeEntrance: function (level, freeCells, fromId) {
        let pos = Utilities.getFreeCell(freeCells);

        if (fromId) {
            level.addExit(pos.x, pos.y, fromId, Tiles.STAIRS_UP);
        }
        level.player.x = pos.x;
        level.player.y = pos.y;
    },
    _placeExit: function (level, freeCells) {
        let pos = Utilities.getFreeCell(freeCells);

        level.addExit(pos.x, pos.y, String(++level.game.world.levelCount), Tiles.STAIRS_DOWN);
    }
}