const Player = require('../Model/Player');
const Util = require('../Util');

const socketIO = require('socket.io');
const io = socketIO();

let playerCnt = 0;

class SocketAPI {
    /** @param {import('socket.io').Server} io */
    constructor(io) {
        this.io = io;
    }

    getAllPlayers() {

        const hasPlayer = entriesPair => entriesPair[1].player;
        const reduceNewPlayerList = (players, entriesPair) => [...players, entriesPair[1].player];

        return Object.entries(this.io.sockets.connected)
            .filter(hasPlayer)
            .reduce(reduceNewPlayerList, []);
    }
}

//Your socket logic here
const socketInstance = new SocketAPI(io);

socketInstance.io.on('connection', (socket) => {

    socket.on('new player',playerInfo => {
        // 告知當前玩家所有玩家列表
        socket.emit('all players', socketInstance.getAllPlayers());

        socket.player = new Player(playerCnt++, playerInfo);
        // socket.emit('create player success', socket.player.id);

        // 告知其他玩家有新玩家登入
        socket.broadcast.emit('has new player', socket.player);
    });

    socket.on('move', position => {

        if (!socket.player) return socket.disconnect();

        socket.player.x = position.x;
        socket.player.y = position.y;

        socket.broadcast.emit('player move', socket.player);
    });

    socket.on('disconnect',function(){

        if (!socket.player) return socket.disconnect();

        io.emit('remove', socket.player.name);
    });
});


module.exports = socketInstance;