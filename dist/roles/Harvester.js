const CreepBase = require("./CreepBase");

class Harvester extends CreepBase {
  work() {
    if (this.creep.store.getFreeCapacity() > 0) {
      this.harvestEnergy();
    } else {
      const storageOrContainer = this.creep.pos.findClosestByPath(
        FIND_STRUCTURES,
        {
          filter: (structure) => {
            return (
              (structure.structureType === STRUCTURE_STORAGE ||
                structure.structureType === STRUCTURE_CONTAINER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          },
        }
      );

      if (storageOrContainer) {
        this.transfer(storageOrContainer, RESOURCE_ENERGY);
      } else {
        this.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY);
      }
    }
  }
}

module.exports = Harvester;
