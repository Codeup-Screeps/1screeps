class Warlord {
  constructor(room) {
    this.room = room;
    this.rcl = this.room.controller.level;
    this.adjacentRooms = this.findAdjacentRooms();
    this.hostileExits = this.findHostileExits();
  }
  run() {
    // console.log(`There are ${this.exits.length} exits in ${this.room.name}.`);
    // console.log(`There are ${this.hostileExits.length} hostile exits in ${this.room.name}.`);
  }
  findAdjacentRooms() {
    let adjacentRooms = [];
    let exits = Game.map.describeExits(this.room.name);
    for (let direction in exits) {
      let roomName = exits[direction];
      if (roomName) {
        adjacentRooms.push(roomName);
      }
    }
    return adjacentRooms;
  }
  findHostileExits() {
    let hostileExits = [];

    return hostileExits;
  }
}

export default Warlord;
