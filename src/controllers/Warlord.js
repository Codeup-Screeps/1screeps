class Warlord {
  constructor(room) {
    this.spawn = room.find(FIND_MY_SPAWNS)[0];
    this.room = room;
    this.rcl = this.room.controller.level;
    this.adjacentRooms = this.findAdjacentRooms();
    this.hostileExits = this.findHostileExits();
    this.energyReserves = this.evaluateRoomEnergy();
    this.pawns = this.getCreeps("pawn");
  }
  run() {
    // console.log(`Current energy reserves: ${this.energyReserves}`);
    // console.log(`There are ${this.exits.length} exits in ${this.room.name}.`);
    // console.log(`There are ${this.hostileExits.length} hostile exits in ${this.room.name}.`);
    if (this.energyReserves > 90 && this.pawns.length < 2) {
      this.spawnPawn();
    } else {
      //   this.botherBillie();
    }
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
  getCreeps(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type);
  }
  evaluateRoomEnergy() {
    // determine current energy in storage/containers, vs capacity
    const containers = this.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER,
    });
    let energyReserves = 0;
    let energyCapacity = 0;
    if (containers.length > 0) {
      containers.forEach((container) => {
        energyReserves += container.store[RESOURCE_ENERGY];
        energyCapacity += container.store.getCapacity(RESOURCE_ENERGY);
      });
    }

    const percentage = (energyReserves / energyCapacity) * 100;
    return percentage;
  }
  spawnPawn() {
    let newName = "Pawn" + Game.time;
    this.spawn.spawnCreep(this.creepLoadout("pawn"), newName, {
      memory: { role: "pawn" },
    });
  }
  creepLoadout(type) {
    let availableEnergy = parseFloat(this.spawn.room.energyAvailable);
    // control the size of harvesters based on available energy
    // console.log(`Building new ${type} screep.`);
    // console.log(`availableEnergy: ${availableEnergy}, minBuild: ${this.minBuild}, maxBuild: ${this.maxBuild}`);
    if (availableEnergy > this.maxBuild) {
      availableEnergy = this.maxBuild;
    }
    const parts = {
      MOVE: 50,
      WORK: 100,
      CARRY: 50,
      ATTACK: 80,
      RANGED_ATTACK: 150,
      HEAL: 250,
      CLAIM: 600,
      TOUGH: 10,
    };
    const body = [];
    switch (type) {
      case "pawn":
        body.push(ATTACK, ATTACK, MOVE, MOVE);
        availableEnergy -= parts["ATTACK"] + parts["ATTACK"] + parts["MOVE"] + parts["MOVE"];
        while (availableEnergy >= parts["ATTACK"] + parts["MOVE"]) {
          body.unshift(ATTACK);
          body.push(MOVE);
          availableEnergy -= parts["ATTACK"] + parts["MOVE"];
        }
        break;
    }
    // const totalCost = body.reduce((total, part) => total + parts[part], 0);
    // console.log(`body: ${body}, totalCost: ${totalCost}`);
    return body;
  }
  botherBillie() {
    this.pawns.forEach((pawn) => {
      pawn.memory.botherBillie = true;
    });
  }
}

export default Warlord;
