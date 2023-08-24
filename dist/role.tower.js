class Tower {
  constructor(tower) {
    this.tower = tower;
  }

  run() {
    // attack hostiles
    const target = this.tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
      this.tower.attack(target);
      return;
    }
    // heal friendlies
    const friendlyTarget = this.tower.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax,
    });
    if (friendlyTarget) {
      this.tower.heal(friendlyTarget);
      return;
    }
    // repair structures (not walls)
    const structureTarget = this.tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.hits < structure.hitsMax &&
        structure.structureType != STRUCTURE_WALL,
    });
    if (structureTarget) {
      this.tower.repair(structureTarget);
      return;
    }
  }
}

module.exports = Tower;
