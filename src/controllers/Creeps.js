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
    this.sources = this.getEnergySources();
    this.creeps = {
      harvesters: this.getCreepsByType("harvester"),
      haulers: this.getCreepsByType("hauler"),
      upgraders: this.getCreepsByType("upgrader"),
      builders: this.getCreepsByType("builder"),
      repairers: this.getCreepsByType("repairer"),
    };
  }
  run() {
    this.assignHaulerSource();
    return;
  }
  assignHaulerSource() {
    // assign a designated source to each hauler in memory
    // if the hauler already has a source, leave it alone
    // otherwise, assign it to the source with the fewest haulers
    this.creeps.haulers.forEach((hauler) => {
      if (hauler.memory.source) {
        return;
      }
      let source = _.min(this.sources, (source) => {
        return _.filter(
          this.creeps.haulers,
          (creep) => creep.memory.source == source.id
        ).length;
      });
      hauler.memory.source = source.id;
    });
  }
  getEnergySources() {
    return this.room.find(FIND_SOURCES);
  }
  getCreepsByType(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type);
  }
}

export default CreepsController;
