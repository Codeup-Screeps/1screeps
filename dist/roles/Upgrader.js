const CreepBase = require("./CreepBase");

class Upgrader extends CreepBase {
  work() {
    if (!this.creep.memory.working && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.working = false;
    } else if (
      this.creep.memory.working &&
      this.creep.store[RESOURCE_ENERGY] === this.creep.store.getCapacity()
    ) {
      this.creep.memory.working = true;
    }

    this.creep.memory.working ? this.upgrade() : this.obtainEnergy();
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
}

module.exports = Upgrader;
