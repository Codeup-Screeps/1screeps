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
          });
        }
        return;
      }

      // if walls to repair
      // only walls constructed by the player
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
          });
        }
        return;
      }
      // If no construction sites or walls, act as upgrader
      if (
        this.creep.upgradeController(this.creep.room.controller) ==
        ERR_NOT_IN_RANGE
      ) {
        // Move to it
        this.creep.moveTo(this.creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    } else {
      // try to withdraw from containers or storage
      const containers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (s) =>
          (s.structureType == STRUCTURE_CONTAINER ||
            s.structureType == STRUCTURE_STORAGE) &&
          s.store[RESOURCE_ENERGY] > 0,
      });

      if (containers.length) {
        const closestContainer = this.creep.pos.findClosestByPath(containers);
        if (
          this.creep.withdraw(closestContainer, RESOURCE_ENERGY) ===
          ERR_NOT_IN_RANGE
        ) {
          this.creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
          return; // Exit early if we're moving to a container or storage
        }
      }

      // try to collect dropped energy
      const droppedEnergy = this.creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
      });

      const closestDroppedEnergy =
        this.creep.pos.findClosestByRange(droppedEnergy);

      if (closestDroppedEnergy) {
        if (this.creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(closestDroppedEnergy, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
          return; // Important to exit early if we found dropped energy
        }
      }
    }
  }
}

module.exports = Builder;
