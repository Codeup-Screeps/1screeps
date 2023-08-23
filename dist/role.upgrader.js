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
      // try to withdraw from containers or storage
      const containers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (s) =>
          (s.structureType == STRUCTURE_CONTAINER ||
            s.structureType == STRUCTURE_STORAGE) &&
          s.store[RESOURCE_ENERGY] > 0,
      });

      if (containers.length) {
        const closestContainer = this.creep.pos.findClosestByPath(containers);
        if (
          this.creep.withdraw(closestContainer, RESOURCE_ENERGY) ===
          ERR_NOT_IN_RANGE
        ) {
          this.creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
          return; // Exit early if we're moving to a container or storage
        }
      }

      // try to collect dropped energy
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
          return; // Important to exit early if we found dropped energy
        }
      }
    }
  }
}

module.exports = RoleUpgrader;
