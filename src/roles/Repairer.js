import CreepBase from "./CreepBase";

class Repairer extends CreepBase {
  /** @param {Creep} creep **/
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    if (this.creep.memory.repairing && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.repairing = false;
      this.creep.say("🔄 collect");
    }
    if (!this.creep.memory.repairing && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.repairing = true;
      this.creep.say("🔧 repair");
    }
    if (this.creep.memory.repairing) {
      if (this.performRepairRole()) {
        return;
      }
      // If no repair sites, help build
      if (this.performBuildRole()) {
        return;
      }
    } else {
      // Collecting logic
      // try to withdraw from containers or storage
      if (this.collectFromContainers()) {
        return;
      }
      // try to collect dropped energy
      if (this.collectEnergyFromGround()) {
        return;
      }
    }
  }
}

export default Repairer;
