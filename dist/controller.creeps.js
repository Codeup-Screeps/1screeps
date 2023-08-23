/* 
This is an idea to make a controller for all creeps, to better manage them
down the road. It's not currently in use. Future ideas:
- Have the controller manage the creeps through persistent memory
- Evaluate the room and assign tasks to creeps based on the room's needs
*/
class CreepsController {
  constructor(spawn) {
    this.spawn = spawn;
    this.room = spawn.room;
    this.sources = this.countEnergySources();
    this.creeps = {
      harvesters: this.getCreepsByType("harvester"),
      haulers: this.getCreepsByType("hauler"),
      upgraders: this.getCreepsByType("upgrader"),
      builders: this.getCreepsByType("builder"),
      repairers: this.getCreepsByType("repairer"),
    };
  }
  run() {
    return;
  }
  countEnergySources() {
    return this.room.find(FIND_SOURCES);
  }
  getCreepsByType(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type);
  }
}

module.exports = CreepsController;
