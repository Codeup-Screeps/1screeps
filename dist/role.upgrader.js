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
      // Try to upgrade the controller. If not in range
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
      // Find energy on the ground
      const droppedEnergy = this.creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
      });

      // Find the closest energy on the ground
      const closestDroppedEnergy =
        this.creep.pos.findClosestByRange(droppedEnergy);

      // Try to pickup the energy. If it's not in range
      if (this.creep.pickup(closestDroppedEnergy) == ERR_NOT_IN_RANGE) {
        // Move to it
        this.creep.moveTo(closestDroppedEnergy, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    }
  }
}

module.exports = RoleUpgrader;
