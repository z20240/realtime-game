import Phaser from 'phaser';
import circle from '../assets/circle.png';
import client from './Client';
import util from './util';


export default class Scene1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene1' });

        /** @type {Phaser.GameObjects.GameObject} */
        this.player = /** @type {Phaser.GameObjects.GameObject} */ ({});
        this.players = {};
    }

    preload() {
        this.load.image('circle', circle);
    }

    create() {
        // 創建一個玩家
        const playerInfo = {
            y: util.randomInt(0, 600),
            x: util.randomInt(0, 800),
            name: util.randomName(),
            scale: {x: 0.05, y: 0.05},
            size: {x:128, y:128},
            color: util.randomColor(),
        }

        this.player = this.createPlayer(playerInfo);
        client.newPlayer(playerInfo);

        // 使用鍵盤管理器創建游標（cursor）对象。
        this.cursors = this.input.keyboard.createCursorKeys();

        // client.Socket.on('create player success', id => {
        //     this.player.id = id;
        // });

        client.Socket.on('has new player', (playerInfo) => {
            this.createPlayer(playerInfo);
        })

        client.Socket.on('all players', (playerInfos) => {
            playerInfos.forEach(playerInfo => {
                this.createPlayer(playerInfo);
            })
        })

        client.Socket.on('player move', player => {
            this.updatePlayer(player);
        })

        client.Socket.on('remove', playerName => {
            this.removePlayer(playerName);
        });
    }

    update() {
        if (this.cursors.left.isDown) this.player.body.setVelocityX(-160);
        else if (this.cursors.right.isDown) this.player.body.setVelocityX(160);
        else if (this.cursors.up.isDown) this.player.body.setVelocityY(-160);
        else if (this.cursors.down.isDown) this.player.body.setVelocityY(160);
        else this.player.body.setVelocity(0, 0);

        client.move(this.player.x, this.player.y);
    }

    createPlayer({x, y, name, scale, size, color}) {
        let player;
        const texture = this.physics.add.sprite(0, 0, 'circle');
        texture.tint = color;
        texture.setScale(scale.x, scale.y);

        const nameLabel = this.add.text(0, 0, name, { fontFamily: '"Roboto Condensed"' });
        nameLabel.setX(-(nameLabel.width / 2));
        nameLabel.setY(-50);

        player = this.add.container(x, y, [ texture, nameLabel ]);

        player.setSize(size.x, size.y);
        this.physics.world.enable(player);

        this.players[name] = player;

        this.setColliderDetectionToEachPlayer();

        return player;
    }

    updatePlayer(player) {
        this.players[player.name].setPosition(player.x, player.y);
    }

    removePlayer(name) {
        this.players[name].destroy();
        delete this.players[name];
    }

    setColliderDetectionToEachPlayer() {
        Object.entries(this.players)
            .filter(entryPair => entryPair[0] !== this.player.name)
            .forEach(entryPair => this.physics.add.overlap(this.player, entryPair[1], this.detectGameOver, null, this))
    }

    detectGameOver(player1, player2) {
        console.log("TCL: detectGameOver -> player1, player2", player1, player2)
    }
}