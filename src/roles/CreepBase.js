class CreepBase {
  constructor(creep) {
    this.creep = creep;
  }

  moveTo(target) {
    const opts = {
      visualizePathStyle: { stroke: "#22bbee" }, // Can customize this color
      reusePath: 10,
    };
    this.creep.moveTo(target, opts);
  }

  harvest(source) {
    const result = this.creep.harvest(source);
    if (result === ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    } else if (result === ERR_BUSY || result === ERR_NOT_ENOUGH_RESOURCES) {
      // Handle other cases or add logging
    }
  }

  harvestEnergy() {
    const source = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
  }

  transfer(target, resource) {
    const result = this.creep.transfer(target, resource);
    if (result === ERR_NOT_IN_RANGE) {
      this.moveTo(target);
    } else if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) {
      // Handle other cases or add logging
    }
  }

  // Utility method to check if the creep is full
  isFull() {
    return this.creep.store.getFreeCapacity() === 0;
  }

  // Utility method to check if the creep is empty
  isEmpty() {
    return this.creep.store[RESOURCE_ENERGY] === 0;
  }

  // Utility method to find closest repairable structure
  findClosestRepairableStructure(minDamage = 100) {
    return this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) =>
        s.hits < s.hitsMax - minDamage && s.structureType !== STRUCTURE_WALL,
    });
  }

  // ... You can add more utility methods as needed
}

module.exports = CreepBase;
