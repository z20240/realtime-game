const Util = require('../../Util');

class Player {
    constructor(id, {name, x, y, scale, size, color}) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.size = size;
        this.color = color;
    }
}

module.exports = Player;