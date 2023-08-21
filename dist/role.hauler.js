class RoleHauler {
  /**
   * @param {Creep} creep
   */
  run(creep) {
    // If the hauler isn't full
    if (creep.store.getFreeCapacity() > 0) {
      // Find energy on the ground
      const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
      });

      // Find the closest energy on the ground
      const closestDroppedEnergy = creep.pos.findClosestByRange(droppedEnergy);

      // Try to pickup the energy. If it's not in range
      if (creep.pickup(closestDroppedEnergy) == ERR_NOT_IN_RANGE) {
        // Move to it
        creep.moveTo(closestDroppedEnergy, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    } else {
      // Find containers in the room that aren't full
      const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (containers.length > 0) {
        // Find the closest container
        const closestContainer = creep.pos.findClosestByRange(containers);

        // Try to transfer energy to the container. If it's not in range
        if (
          creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          // Move to it
          creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      } else {
        // Find spawns in the room
        const spawns = creep.room.find(FIND_MY_SPAWNS);

        // Find the closest spawn
        const closestSpawn = creep.pos.findClosestByRange(spawns);

        // Try to transfer energy to the spawn. If it's not in range
        if (creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          creep.moveTo(closestSpawn, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      }
    }
  }
}

module.exports = RoleHauler;
