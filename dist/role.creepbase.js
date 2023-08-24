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
  performUpgradeRole() {
    if (
      this.creep.upgradeController(this.creep.room.controller) ==
      ERR_NOT_IN_RANGE
    ) {
      // Move to it
      this.creep.moveTo(this.creep.room.controller, {
        visualizePathStyle: { stroke: "#ffffff" },
        // ignoreCreeps: true,
        reusePath: 1,
      });
    } else {
      // check if there are screeps behind it
      const behind = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
      // if there are, move closer to the controller to give them room
      if (behind.length > 0) {
        this.creep.moveTo(this.creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      }
    }
  }
  performRepairRole() {
    // Repairing logic
    let structuresToRepair = this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.hits < structure.hitsMax &&
        structure.structureType != STRUCTURE_WALL,
    });
    // filter out ramparts if they are below 50k hits
    structuresToRepair = structuresToRepair.filter(
      (structure) =>
        structure.structureType != STRUCTURE_RAMPART || structure.hits > 50000
    );
    structuresToRepair.sort((a, b) => a.hits - b.hits); // Repair the most damaged first

    if (structuresToRepair.length > 0) {
      // Non road structures
      const nonRoadStructuresToRepair = structuresToRepair.filter(
        (structure) => structure.structureType != STRUCTURE_ROAD
      );
      // Non road structures with less than half hits
      const nonRoadStructuresToRepairLessThanHalf =
        nonRoadStructuresToRepair.filter(
          (structure) => structure.hits < structure.hitsMax / 2
        );
      if (nonRoadStructuresToRepairLessThanHalf.length > 0) {
        structuresToRepair = nonRoadStructuresToRepairLessThanHalf;
      }

      if (this.creep.repair(structuresToRepair[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(structuresToRepair[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      }
      return true;
    } else {
      // No structures to repair, so consider other tasks or stay idle
      // e.g., creep.moveTo(Game.flags["IdleFlag"]);
      return false;
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
          //   ignoreCreeps: true,
          reusePath: 1,
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
          //   ignoreCreeps: true,
          reusePath: 1,
        });
        return true;
      }
    }
    return false;
  }
}

module.exports = CreepBase;
