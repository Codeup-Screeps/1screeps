const clearMemory = () => {
  // Loop through each creep's name in Memory.creeps
  for (var creepName in Memory.creeps) {
    // If the creep's name isn't in Game.creeps
    if (!Game.creeps[creepName]) {
      // Remove it from the memory and log that it did so
      delete Memory.creeps[creepName];
      // console.log("Clearing non-existing creep memory:", creepName);
    }
  }
  // Loop through each room's name in Memory.rooms
  for (var roomName in Memory.rooms) {
    // If the room's name isn't in Game.rooms
    if (!Game.rooms[roomName]) {
      // Remove it from the memory and log that it did so
      delete Memory.rooms[roomName];
      // console.log("Clearing non-existing room memory:", roomName);
    }
  }
};

export default clearMemory;
