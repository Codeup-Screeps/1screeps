const CreepBase = require("role.creepbase");

class RoleUpgrader extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // this.addRoadSites();
    // If the creep is upgrading and is empty
    if (this.creep.memory.upgrading && this.creep.store[RESOURCE_ENERGY] == 0) {
      // Set upgrading to false and say so
      this.creep.memory.upgrading = false;
      this.creep.say("🔄 harvest");
    }
    // Otherwise if the creep is not upgrading but is full
    else if (
      !this.creep.memory.upgrading &&
      this.creep.store.getFreeCapacity() == 0
    ) {
      // Set upgrading to true and say so
      this.creep.memory.upgrading = true;
      this.creep.say("⚡ upgrade");
    }

    // This is having the creep operate based on the upgrading state

    // If the creep is upgrading
    if (this.creep.memory.upgrading) {
      // Move to and upgrade the controller
      this.performUpgradeController();
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

module.exports = RoleUpgrader;
