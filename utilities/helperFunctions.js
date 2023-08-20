function handleStuckCreeps() {
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (!creep.memory.lastPosition) {
      creep.memory.lastPosition = {
        x: creep.pos.x,
        y: creep.pos.y,
        tick: Game.time,
      };
    } else {
      // Check if the creep has moved in the last 10 ticks
      if (
        creep.memory.lastPosition.x === creep.pos.x &&
        creep.memory.lastPosition.y === creep.pos.y &&
        Game.time - creep.memory.lastPosition.tick > 10
      ) {
        // Move the creep to a random adjacent position
        const randomDirection = Math.floor(Math.random() * 8) + 1; // values between 1 and 8
        creep.move(randomDirection);

        // Reset the lastPosition for the next check
        creep.memory.lastPosition = {
          x: creep.pos.x,
          y: creep.pos.y,
          tick: Game.time,
        };
      } else if (
        creep.memory.lastPosition.x !== creep.pos.x ||
        creep.memory.lastPosition.y !== creep.pos.y
      ) {
        // Update position if the creep moved
        creep.memory.lastPosition = {
          x: creep.pos.x,
          y: creep.pos.y,
          tick: Game.time,
        };
      }
    }
  }
}
function getDesiredCounts() {
  const sources = Game.spawns["Spawn1"].room.find(FIND_SOURCES);
  const storages = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType === STRUCTURE_STORAGE,
  });

  return {
    harvester: sources.length * 3,
    upgrader: storages.length > 0 ? 5 : 2,
    builder:
      Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES).length > 0
        ? 3
        : 0,
  };
}

module.exports = { handleStuckCreeps, getDesiredCounts };
