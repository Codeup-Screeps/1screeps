import CreepBase from "./CreepBase";

class RoleHauler extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    this.switchModes();
    // If collecting
    if (!this.creep.memory.hauling) {
      if (this.creep.memory.refillSpawn === true) {
        if (this.collectFromContainers()) {
          return;
        }
        if (this.collectFromStorage()) {
          return;
        }
      }
      if (this.collectEnergyFromGround(this.creep.memory.source)) {
        return;
      }
    } else {
      // If there is a spawn that needs energy
      if (this.depositToSpawn()) {
        return;
      }
      // If there is an extension that needs energy
      if (this.depositToExtensions()) {
        return;
      }

      // If there are towers that need energy
      const towers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 500,
      });
      if (towers.length > 0) {
        // Try to transfer energy to the tower. If it's not in range
        if (this.creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(towers[0]);
        }
        return;
      }

      // If there are containers that need energy
      if (this.depositToContainer()) {
        return;
      }

      // If there is storage that isn't full
      if (this.depositToStorage()) {
        return;
      }

      // if no containers, move to spawn and drop energy
      const spawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
      if (this.creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(spawn);
      } else {
        this.creep.drop(RESOURCE_ENERGY);
        // head back toward source and wait
        this.creep.memory.hauling = false;
        this.creep.say("🔄 collect");
      }
    }
  }
  switchModes() {
    if (this.creep.memory.hauling && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.hauling = false;
      this.creep.say("🔄 collect");
    }
    if (!this.creep.memory.hauling && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.hauling = true;
      this.creep.say("📦 haul");
    }
  }
}

export default RoleHauler;
