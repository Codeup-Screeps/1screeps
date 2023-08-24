import CreepBase from "./CreepBase";

class RoleHarvester extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // Initialize harvester memory if not done
    if (this.creep.memory.settled === undefined) {
      this.creep.memory.settled = false;
    }

    // If the harvester is settled, try to harvest without moving
    if (this.creep.memory.settled) {
      const source = this.creep.pos.findClosestByRange(FIND_SOURCES);
      if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // If no active source in range, unset the settled flag
        this.creep.memory.settled = false;
      }
      return; // Exit early to prevent movement
    }

    // Find sources in the room
    const sources = this.creep.room.find(FIND_SOURCES);

    // Filter sources based on the number of settled harvesters around them
    const availableSources = sources.filter((source) => {
      const positions = [
        [source.pos.x - 1, source.pos.y - 1],
        [source.pos.x, source.pos.y - 1],
        [source.pos.x + 1, source.pos.y - 1],
        [source.pos.x - 1, source.pos.y],
        [source.pos.x + 1, source.pos.y],
        [source.pos.x - 1, source.pos.y + 1],
        [source.pos.x, source.pos.y + 1],
        [source.pos.x + 1, source.pos.y + 1],
      ];

      let settledHarvesters = 0;

      for (let pos of positions) {
        const creepsAtPos = this.creep.room.lookForAt(
          LOOK_CREEPS,
          pos[0],
          pos[1]
        );
        for (let creepAtPos of creepsAtPos) {
          if (
            creepAtPos.memory.settled &&
            creepAtPos.memory.role === "harvester"
          ) {
            settledHarvesters++;
          }
        }
      }
      return settledHarvesters < 1; // Choose sources with fewer than this amount of settled harvesters
    });

    // Find the closest available source to the creep
    const closestAvailableSource =
      this.creep.pos.findClosestByRange(availableSources);

    if (closestAvailableSource) {
      const harvestResult = this.creep.harvest(closestAvailableSource);

      if (harvestResult == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(closestAvailableSource, {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      } else if (harvestResult == OK) {
        // Check if the harvester is adjacent to the source
        if (this.creep.pos.isNearTo(closestAvailableSource.pos)) {
          this.creep.memory.settled = true;
        }
      }
    }
  }
}

export default RoleHarvester;
