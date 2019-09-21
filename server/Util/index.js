module.exports = {
    randomInt (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    },
    randomName() {
        const alphabat = "abcdefghijklmnopqurstuvwxyz1234567890";
        return "0".repeat(8).split("").map(x => alphabat[this.randomInt(0, alphabat.length)]).join("");
    }
}