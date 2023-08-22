class SpawnController {
  constructor(spawn) {
    this.spawn = spawn;
    this.harvesters = this.countCreeps("harvester");
    this.haulers = this.countCreeps("hauler");
    this.upgraders = this.countCreeps("upgrader");
    this.builders = this.countCreeps("builder");
    this.repairers = this.countCreeps("repairer");
  }
  run() {
    this.spawnNewCreeps();
    this.announceNewCreeps();
  }
  countCreeps(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type).length;
  }
  spawnNewCreeps() {
    // If there aren't enough harvesters
    if (this.harvesters < 4) {
      // Spawn a new one

      var newName = "Harvester" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("harvester"), newName, {
        memory: { role: "harvester" },
      });
    }
    // Otherwise if there aren't enough haulers
    else if (this.haulers < 3) {
      // Spawn a new one

      var newName = "Hauler" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("hauler"), newName, {
        memory: { role: "hauler" },
      });
    }
    // Otherwise if there aren't enough upgraders
    else if (this.upgraders < 3) {
      // Spawn a new one

      var newName = "Upgrader" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("upgrader"), newName, {
        memory: { role: "upgrader", upgrading: false },
      });
    }
    // Otherwise if there aren't enough builders
    else if (this.builders < 3) {
      // Spawn a new one

      var newName = "Builder" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("builder"), newName, {
        memory: { role: "builder", building: false },
      });
    }
    // Otherwise if there aren't enough repairers
    else if (this.repairers < 2) {
      // Spawn a new one
      var newName = "Repairer" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("repairer"), newName, {
        memory: { role: "repairer", repairing: false },
      });
    }
  }
  announceNewCreeps() {
    if (this.spawn.spawning) {
      // Get the creep being spawned

      var spawningCreep = Game.creeps[this.spawn.spawning.name];

      // Visualize the role of the spawning creep above the spawn
      this.spawn.room.visual.text(
        "🛠️" + spawningCreep.memory.role,
        this.spawn.pos.x + 1,
        this.spawn.pos.y,
        { align: "left", opacity: 0.8 }
      );
    }
  }
  creepLoadout(type) {
    let availableEnergy = parseFloat(this.spawn.room.energyAvailable);
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
      case "harvester":
        body.push(MOVE);
        availableEnergy -= parts["MOVE"];
        while (availableEnergy >= parts["WORK"]) {
          body.push(WORK);
          availableEnergy -= parts["WORK"];
        }
        break;
      case "hauler":
        body.push(CARRY, CARRY, MOVE, MOVE);
        availableEnergy -=
          parts["CARRY"] + parts["CARRY"] + parts["MOVE"] + parts["MOVE"];
        while (availableEnergy >= parts["CARRY"] + parts["MOVE"]) {
          body.unshift(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["CARRY"] + parts["MOVE"];
        }
        break;
      case "upgrader":
        body.push(WORK, CARRY, MOVE);
        availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        while (
          availableEnergy >=
          parts["WORK"] + parts["CARRY"] + parts["MOVE"]
        ) {
          body.unshift(WORK);
          body.push(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        }
        break;
      case "builder":
        body.push(WORK, CARRY, MOVE);
        availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        while (
          availableEnergy >=
          parts["WORK"] + parts["CARRY"] + parts["MOVE"]
        ) {
          body.unshift(WORK);
          body.push(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        }
        break;
      case "repairer":
        body.push(WORK, CARRY, MOVE);
        availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        while (
          availableEnergy >=
          parts["WORK"] + parts["CARRY"] + parts["MOVE"]
        ) {
          body.unshift(WORK);
          body.push(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        }
        break;
    }
    // const totalCost = body.reduce((total, part) => total + parts[part], 0);
    // console.log(`body: ${body}, totalCost: ${totalCost}`);
    return body;
  }
}

module.exports = SpawnController;
