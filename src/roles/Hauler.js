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
      // First check if there is extra dropped energy around the spawn
      if (this.collectingAroundSpawn()) {
        return;
      }
      // move toward creep.memory.source
      if (this.collectFromHarvester()) {
        return;
      }

      this.collectFromHarvester();
    } else {
      // Find spawns in the room that aren't full
      const spawns = this.creep.room.find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (spawns.length > 0) {
        // Find the closest spawn
        const closestSpawn = this.creep.pos.findClosestByRange(spawns);

        // Try to transfer energy to the spawn. If it's not in range
        if (this.creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
        filter: (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (extensions.length > 0) {
        // Find the closest extension
        const closestExtension = this.creep.pos.findClosestByRange(extensions);

        // Try to transfer energy to the extension. If it's not in range
        if (this.creep.transfer(closestExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestExtension, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find towers in the room that are not below 50% energy
      const towers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 500,
      });
      if (towers.length > 0) {
        // Try to transfer energy to the tower. If it's not in range
        if (this.creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(towers[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find containers in the room that aren't full
      const containers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (containers.length > 0) {
        // Find the closest container
        const closestContainer = this.creep.pos.findClosestByRange(containers);

        // Try to transfer energy to the container. If it's not in range
        if (this.creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find storage in the room that isn't full
      const storage = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (storage.length > 0) {
        // Find the closest storage
        const closestStorage = this.creep.pos.findClosestByRange(storage);

        // Try to transfer energy to the storage. If it's not in range
        if (this.creep.transfer(closestStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestStorage, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      } else {
        // if no containers, move to spawn and drop energy
        const spawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (this.creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(spawn, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        } else {
          this.creep.drop(RESOURCE_ENERGY);
          // head back toward source and wait
          this.creep.memory.hauling = false;
          this.creep.say("🔄 collect");
        }
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
  collectingAroundSpawn() {
    const spawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
    const spawnDroppedEnergy = spawn.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });
    // if there is dropped energy around it and it's not full
    if (spawnDroppedEnergy.length > 0 && spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      // try to pick it up
      if (this.creep.pickup(spawnDroppedEnergy[0]) == ERR_NOT_IN_RANGE) {
        // move to it
        this.creep.moveTo(spawnDroppedEnergy[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
        return true;
      }
      return true;
    }
    return false;
  }
  collectFromHarvester() {
    const droppedEnergy = this.creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });
    if (droppedEnergy.length > 0) {
      // largest energy first
      droppedEnergy.sort((a, b) => b.amount - a.amount);
      if (this.creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(droppedEnergy[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
      }
      return true;
    }
  }
}

export default RoleHauler;
