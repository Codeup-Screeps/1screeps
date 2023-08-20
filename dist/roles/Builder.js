const CreepBase = require("./CreepBase");

class Builder extends CreepBase {
  work() {
    if (this.creep.memory.building && this.creep.store[RESOURCE_ENERGY] == 0) {
      this.creep.memory.building = false;
    } else if (
      !this.creep.memory.building &&
      this.creep.store.getFreeCapacity() == 0
    ) {
      this.creep.memory.building = true;
    }

    this.creep.memory.building ? this.build() : this.obtainEnergy();
  }

  obtainEnergy() {
    const storageOrContainer = this.creep.pos.findClosestByPath(
      FIND_STRUCTURES,
      {
        filter: (structure) => {
          return (
            (structure.structureType === STRUCTURE_STORAGE ||
              structure.structureType === STRUCTURE_CONTAINER) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
          );
        },
      }
    );

    if (storageOrContainer) {
      if (
        this.creep.withdraw(storageOrContainer, RESOURCE_ENERGY) ===
        ERR_NOT_IN_RANGE
      ) {
        this.moveTo(storageOrContainer);
      }
    } else {
      this.harvestEnergy();
    }
  }

  build() {
    const target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
      if (this.creep.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    } else {
      // No construction sites. Consider making the builder do something else, e.g., act as an upgrader
      this.upgrade();
    }
  }
}

module.exports = Builder;
