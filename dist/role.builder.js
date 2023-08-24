const CreepBase = require("role.creepbase");
class Builder extends CreepBase {
  /** @param {Creep} creep **/
  constructor(creep) {
    super(creep);
    this.repairWalls = false;
  }
  run() {
    // Switching between modes
    if (this.creep.memory.building && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.building = false;
      this.creep.say("🔄 collect");
    }
    if (
      !this.creep.memory.building &&
      this.creep.store.getFreeCapacity() === 0
    ) {
      this.creep.memory.building = true;
      this.creep.say("🚧 build");
    }

    if (this.creep.memory.building) {
      // Simplified building logic
      let targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
            // ignoreCreeps: true,
            reusePath: 1,
          });
        }
        return;
      }

      // if walls to repair
      const wallsToRepair = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.structureType == STRUCTURE_WALL &&
          structure.hits < structure.hitsMax &&
          structure.hits < 1000000,
      });

      if (wallsToRepair.length > 0 && this.repairWalls) {
        wallsToRepair.sort((a, b) => a.hits - b.hits); // Repair the most damaged first
        if (this.creep.repair(wallsToRepair[0]) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(wallsToRepair[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // If no construction sites, perform backup role
      this.performRepairRole();
    } else {
      // try to withdraw from containers or storage
      if (this.collectFromContainers()) {
        return;
      }
      // try to collect dropped energy
      if (this.collectFromGround()) {
        return;
      }
    }
  }
}

module.exports = Builder;
