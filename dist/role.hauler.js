const CreepBase = require("role.creepbase");
class RoleHauler extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    if (this.creep.memory.hauling && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.hauling = false;
      this.creep.say("🔄 collect");
    }
    if (
      !this.creep.memory.hauling &&
      this.creep.store.getFreeCapacity() === 0
    ) {
      this.creep.memory.hauling = true;
      this.creep.say("📦 haul");
    }
    // If collecting
    if (!this.creep.memory.hauling) {
      // move toward creep.memory.source
      const source = Game.getObjectById(this.creep.memory.source);
      // if not within 10 range of source
      if (this.creep.pos.getRangeTo(source) > 3) {
        // move toward source
        this.creep.moveTo(source, {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
        return;
      }
      // Get all the dropped energy
      const droppedEnergy = this.creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
      });
      // Find the closest dropped energy
      const closestDroppedEnergy =
        this.creep.pos.findClosestByRange(droppedEnergy);
      // Try to pickup the energy. If it's not in range
      if (this.creep.pickup(closestDroppedEnergy) == ERR_NOT_IN_RANGE) {
        // Move to it
        this.creep.moveTo(closestDroppedEnergy, {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
      }
    } else {
      // Find spawns in the room that aren't full
      const spawns = this.creep.room.find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (spawns.length > 0) {
        // Find the closest spawn
        const closestSpawn = this.creep.pos.findClosestByRange(spawns);

        // Try to transfer energy to the spawn. If it's not in range
        if (
          this.creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          // Move to it
          this.creep.moveTo(closestSpawn, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find extensions in the room that aren't full
      const extensions = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.structureType == STRUCTURE_EXTENSION &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (extensions.length > 0) {
        // Find the closest extension
        const closestExtension = this.creep.pos.findClosestByRange(extensions);

        // Try to transfer energy to the extension. If it's not in range
        if (
          this.creep.transfer(closestExtension, RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          // Move to it
          this.creep.moveTo(closestExtension, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find towers in the room that aren't full
      const towers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.structureType == STRUCTURE_TOWER &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (towers.length > 0) {
        // Find the closest tower
        const closestTower = this.creep.pos.findClosestByRange(towers);

        // Try to transfer energy to the tower. If it's not in range
        if (
          this.creep.transfer(closestTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          // Move to it
          this.creep.moveTo(closestTower, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find containers in the room that aren't full
      const containers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (containers.length > 0) {
        // Find the closest container
        const closestContainer = this.creep.pos.findClosestByRange(containers);

        // Try to transfer energy to the container. If it's not in range
        if (
          this.creep.transfer(closestContainer, RESOURCE_ENERGY) ==
          ERR_NOT_IN_RANGE
        ) {
          // Move to it
          this.creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      } else {
        // park the hauler at a flag named "Garage"
        const garageFlag = Game.flags["Garage"];
        if (garageFlag) {
          this.creep.moveTo(garageFlag, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
      }
    }
  }
}

module.exports = RoleHauler;
