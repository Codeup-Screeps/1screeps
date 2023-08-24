import CreepsController from "./Creeps";

class SpawnController {
  constructor(spawn) {
    this.spawn = spawn;
    // get a count of all creep roles
    this.harvesters = this.countCreeps("harvester");
    this.haulers = this.countCreeps("hauler");
    this.upgraders = this.countCreeps("upgrader");
    this.builders = this.countCreeps("builder");
    this.repairers = this.countCreeps("repairer");
    // count the amount of sources in the room as part of logic
    // for creep spawning
    this.sourceCount = this.spawn.room.find(FIND_SOURCES).length;
    //count extensions
    this.extensions = this.spawn.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_EXTENSION,
    }).length;
    // wait on energy to create larger creeps
    this.minBuild = 300 + 50 * this.extensions;
    // in the case of a base meltdown, let spawn create smaller creeps
    if (this.harvesters === 0 || this.haulers < 2) {
      this.minBuild = 300;
    }
    this.creepsController = new CreepsController(spawn);
  }
  run() {
    let availableEnergy = parseFloat(this.spawn.room.energyAvailable);
    if (availableEnergy < this.minBuild) {
      return;
    }
    this.spawnNewCreeps();
    this.announceNewCreeps();
    this.creepsController.run();
  }
  countCreeps(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type).length;
  }
  spawnNewCreeps() {
    // If there aren't enough harvesters
    if (this.harvesters < this.sourceCount) {
      // Spawn a new one

      var newName = "Harvester" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("harvester"), newName, {
        memory: { role: "harvester" },
      });
    }
    // Otherwise if there aren't enough haulers
    else if (this.haulers < this.sourceCount * 1) {
      // Spawn a new one

      var newName = "Hauler" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("hauler"), newName, {
        memory: { role: "hauler" },
      });
    }
    // Otherwise if there aren't enough builders
    else if (this.builders < 2) {
      // Spawn a new one

      var newName = "Builder" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("builder"), newName, {
        memory: { role: "builder", building: false },
      });
    }
    // Otherwise if there aren't enough repairers
    else if (this.repairers < 1) {
      // Spawn a new one
      var newName = "Repairer" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("repairer"), newName, {
        memory: { role: "repairer", repairing: false },
      });
    }
    // Otherwise if there aren't enough upgraders
    else if (this.upgraders < 2) {
      // Spawn a new one

      var newName = "Upgrader" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("upgrader"), newName, {
        memory: { role: "upgrader", upgrading: false },
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
        if (availableEnergy > 500) {
          availableEnergy = 500;
        }
        body.push(MOVE);
        availableEnergy -= parts["MOVE"];
        // harvesters mostly work, but need to replace dead ones quicker
        for (let i = 1; availableEnergy >= parts["WORK"]; i++) {
          if (i % 3 === 0) {
            body.unshift(MOVE);
            availableEnergy -= parts["MOVE"];
          } else {
            body.push(WORK);
            availableEnergy -= parts["WORK"];
          }
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

export default SpawnController;
