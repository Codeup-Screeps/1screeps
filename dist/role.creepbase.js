class CreepBase {
  constructor(creep) {
    this.creep = creep;
  }
  addRoadSites() {
    // if current position doesn't have a road, create construction site
    if (
      this.creep.room.lookForAt(
        LOOK_STRUCTURES,
        this.creep.pos.x,
        this.creep.pos.y
      ).length == 0 &&
      this.creep.room.lookForAt(
        LOOK_CONSTRUCTION_SITES,
        this.creep.pos.x,
        this.creep.pos.y
      ).length == 0
    ) {
      this.creep.room.createConstructionSite(
        this.creep.pos.x,
        this.creep.pos.y,
        STRUCTURE_ROAD
      );
    }
  }
  performUpgradeController() {
    if (
      this.creep.upgradeController(this.creep.room.controller) ==
      ERR_NOT_IN_RANGE
    ) {
      // Move to it
      this.creep.moveTo(this.creep.room.controller, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    } else {
      // check if there are screeps behind it
      const behind = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
      // if there are, move closer to the controller to give them room
      if (behind.length > 0) {
        this.creep.moveTo(this.creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  }
  collectFromContainers() {
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
        return true; // Exit early if we're moving to a container or storage
      }
    }
    return false;
  }
  collectFromGround() {
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
        return true;
      }
    }
    return false;
  }
}

module.exports = CreepBase;
