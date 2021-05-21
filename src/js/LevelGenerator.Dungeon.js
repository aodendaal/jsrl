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

        let map = new ROT.Map.Digger(width, height - topOffset - bottomOffset);
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
        let rooms = map.getRooms();

        this._placeEntrance(level, rooms, freeCells, fromId);

        Utilities.placeBeings(level, freeCells);

        Utilities.placeGold(level, freeCells);

        Utilities.placeItems(level, freeCells);

        this._placeExit(level, rooms, freeCells);
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
    _placeEntrance: function (level, rooms, freeCells, fromId) {
        let pos = this._getRoomCenter(rooms, freeCells);

        if (fromId) {
            level.addExit(pos.x, pos.y, fromId, Tiles.STAIRS_UP);
        }
        level.player.x = pos.x;
        level.player.y = pos.y;
    },
    _placeExit: function (level, rooms, freeCells) {
        let pos = this._getRoomCenter(rooms, freeCells);

        level.addExit(pos.x, pos.y, String(++level.game.world.levelCount), Tiles.STAIRS_DOWN);
    }
}