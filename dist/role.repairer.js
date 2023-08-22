const CreepBase = require("role.creepbase");

class Repairer extends CreepBase {
  /** @param {Creep} creep **/
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    if (
      this.creep.memory.repairing &&
      this.creep.store[RESOURCE_ENERGY] === 0
    ) {
      this.creep.memory.repairing = false;
      this.creep.say("🔄 collect");
    }
    if (
      !this.creep.memory.repairing &&
      this.creep.store.getFreeCapacity() === 0
    ) {
      this.creep.memory.repairing = true;
      this.creep.say("🔧 repair");
    }

    if (this.creep.memory.repairing) {
      // Repairing logic
      let structuresToRepair = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.hits < structure.hitsMax &&
          structure.structureType != STRUCTURE_WALL,
      });
      structuresToRepair.sort((a, b) => a.hits - b.hits); // Repair the most damaged first

      if (structuresToRepair.length > 0) {
        // Non road structures
        const nonRoadStructuresToRepair = structuresToRepair.filter(
          (structure) => structure.structureType != STRUCTURE_ROAD
        );
        // Non road structures with less than half hits
        const nonRoadStructuresToRepairLessThanHalf =
          nonRoadStructuresToRepair.filter(
            (structure) => structure.hits < structure.hitsMax / 2
          );
        if (nonRoadStructuresToRepairLessThanHalf.length > 0) {
          structuresToRepair = nonRoadStructuresToRepairLessThanHalf;
        }

        if (this.creep.repair(structuresToRepair[0]) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(structuresToRepair[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      } else {
        // No structures to repair, so consider other tasks or stay idle
        // e.g., creep.moveTo(Game.flags["IdleFlag"]);
      }
    } else {
      // Collecting logic (similar to the Hauler class you provided)
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
        }
      } else {
        // If no dropped energy, you can add behavior here to revert to harvesting or other tasks
        // ... (rest of collecting logic)
      }
    }
  }
}

module.exports = Repairer;
