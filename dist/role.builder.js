class Builder {
  /** @param {Creep} creep **/
  run(creep) {
    // Switching between modes
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.building = false;
      creep.say("🔄 collect");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      // Simplified building logic
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        // For debugging: If no construction sites, output a message to the console
        console.log("Builder found no construction sites.");
      }
    } else {
      // First, try to collect dropped energy
      const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
      });

      const closestDroppedEnergy = creep.pos.findClosestByRange(droppedEnergy);

      if (closestDroppedEnergy) {
        if (creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(closestDroppedEnergy, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
          return; // Important to exit early if we found dropped energy
        }
      }

      // If no dropped energy, try to withdraw from containers or storage
      const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (s) =>
          (s.structureType == STRUCTURE_CONTAINER ||
            s.structureType == STRUCTURE_STORAGE) &&
          s.store[RESOURCE_ENERGY] > 0,
      });

      if (containers.length) {
        const closestContainer = creep.pos.findClosestByPath(containers);
        if (
          creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
          return; // Exit early if we're moving to a container or storage
        }
      }

      // If nothing else, then harvest from source (least efficient)
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}

module.exports = Builder;
