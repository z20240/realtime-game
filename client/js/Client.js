import io from 'socket.io-client';
import Phaser from 'phaser';
const socket = io("http://" + window.location.hostname + ":3000/", {
    reconnection: true
});

class Client {
    /** @param {SocketIOClient.Socket} socket */
    constructor(socket) {
        // @ts-ignore
        Client.socket = socket;
        this.socket = socket;
    }

    newPlayer(playerInfo) {
        console.log("TCL: Client -> newPlayer -> playerInfo", playerInfo)
        this.socket.emit('new player', playerInfo);

        this.socket.on('disconnect', function() {
            location.reload();
        })
    }

    move(x, y) {
        this.socket.emit('move', {x, y});
    }

    get Socket() {
        return this.socket;
    }


}

export default new Client(socket);