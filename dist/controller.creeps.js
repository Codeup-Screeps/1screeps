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
